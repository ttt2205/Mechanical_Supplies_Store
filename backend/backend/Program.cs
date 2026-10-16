using backend;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using backend.Services;
using backend.Interfaces;
using Microsoft.OpenApi.Models;
using backend.Middleware;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Show PII in IdentityModel logs for debugging
Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;

// Add services to the container for using DI.
builder.Services.AddScoped<IBasicService, BasicService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IRolePermissionService, RolePermissionService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPartnerService, PartnerService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<backend.Data.ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
});

// Cấu hình Redis với cơ chế fallback tự động sang In-Memory Cache khi Redis không khả dụng
var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection");
bool isRedisConnected = false;

if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    try
    {
        var redisOptions = ConfigurationOptions.Parse(redisConnectionString);
        redisOptions.ConnectTimeout = 1500;
        redisOptions.SyncTimeout = 1500;
        redisOptions.AbortOnConnectFail = true;

        var multiplexer = ConnectionMultiplexer.Connect(redisOptions);
        if (multiplexer.IsConnected)
        {
            isRedisConnected = true;
            builder.Services.AddSingleton<IConnectionMultiplexer>(multiplexer);
            builder.Services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
            });
            Console.WriteLine("[CACHE INFO] Kết nối Redis thành công.");
        }
        else
        {
            multiplexer.Dispose();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[CACHE WARNING] Không thể kết nối tới Redis ({ex.Message}). Tự động kích hoạt In-Memory Distributed Cache dự phòng.");
    }
}

if (!isRedisConnected)
{
    builder.Services.AddDistributedMemoryCache();
    Console.WriteLine("[CACHE INFO] Đã kích hoạt Distributed Memory Cache (RAM) dự phòng.");
}

builder.Services.AddScoped<backend.Interfaces.ICacheService, backend.Services.CacheService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            var errorMessage = string.Join(" ", errors);
            var response = backend.Domains.Response.ApiResponse<object>.FailureResult(errorMessage, null, 400);
            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(response);
        };
    });

// Đăng ký dịch vụ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowCredentials()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Cấu hình xác thực JWT Bearer cho hệ thống
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"[JWT ERROR] Authentication failed. Exception: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                // Strip quotes if accidentally sent by frontend localStorage
                token = token.Replace("\"", "").Replace("'", "").Trim();
                context.Token = token;

                // --- DEBUG LOGGING ---
                Console.WriteLine($"\n--- DEBUG TOKEN IN OnMessageReceived ---");
                Console.WriteLine($"Token length: {token.Length}");
                Console.WriteLine($"Token first 20 chars: {token.Substring(0, Math.Min(20, token.Length))}");
                try
                {
                    var handler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
                    var jwt = handler.ReadJsonWebToken(token);
                    Console.WriteLine($"Decoded Issuer: {jwt.Issuer ?? "NULL"}");
                    Console.WriteLine($"Decoded Audience: {string.Join(", ", jwt.Audiences)}");
                    Console.WriteLine($"ALL CLAIMS:");
                    foreach (var claim in jwt.Claims)
                    {
                        Console.WriteLine($" - {claim.Type}: {claim.Value}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to decode JWT manually: {ex.Message}");
                }
                Console.WriteLine($"----------------------------------------\n");
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine($"[JWT INFO] Token validated successfully for user: {context.Principal?.Identity?.Name}");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine($"[JWT ERROR] Challenge triggered. Error: {context.Error}, ErrorDescription: {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Please paste your JWT Token string here (NO need to prefix with 'Bearer ')."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddHostedService<backend.Services.TokenCleanupService>();

var app = builder.Build();

// --- BẮT ĐẦU ĐOẠN CODE TEST KẾT NỐI ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<backend.Data.ApplicationDbContext>();
        Console.WriteLine("Checking Database connection...");
        var isConnected = context.Database.CanConnect();

        if (isConnected)
        {
            Console.WriteLine("DATABASE CONNECTION SUCCESSFUL!");
        }
        else
        {
            Console.WriteLine("CANNOT CONNECT TO DATABASE.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"DATABASE CONNECTION ERROR: {ex.Message}");
    }
}
// --- KẾT THÚC ĐOẠN CODE TEST KẾT NỐI ---

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Tắt HttpsRedirection ở local để tránh lỗi SSL Certificate
// app.UseHttpsRedirection();

// QUAN TRỌNG: Thứ tự Middleware chuẩn xác
app.UseRouting();

app.UseCors("AllowAll");

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();
app.UseMiddleware<TokenValidationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();