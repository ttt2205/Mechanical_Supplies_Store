using backend.Data;
using backend.Domains.Dtos.Auth;
using backend.Domains.Entities;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            if (await _context.Accounts.AnyAsync(a => a.Username == request.Username))
                throw new AppException("Username already exists.");

            if (await _context.Accounts.AnyAsync(a => a.Email == request.Email))
                throw new AppException("Email already in use.");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Code == "customer");
            if (role == null)
            {
                role = new Role { Code = "customer", Name = "Customer" };
                _context.Roles.Add(role);
            }

            var account = new Account
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Phone = request.Phone,
                Role = role,
                Status = "ACTIVE",
                CreationTime = DateTime.UtcNow,
                LastModificationTime = DateTime.UtcNow
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return await LoginAsync(new LoginRequestDto { Username = request.Username, Password = request.Password });
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var account = await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Username == request.Username);

            if (account == null || !BCrypt.Net.BCrypt.Verify(request.Password, account.PasswordHash))
                throw new AppException("Incorrect username or password.");

            if (account.Status != "ACTIVE")
                throw new AppException("Your account is locked or not activated.");

            var accessToken = GenerateJwtToken(account);
            var refreshToken = GenerateRefreshToken();

            account.RefreshToken = refreshToken;
            account.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            // Sửa lỗi tiềm ẩn Null Reference ở Permission
            var permissions = await _context.RolePermissions
                .Include(rp => rp.Permission)
                .Where(rp => rp.RoleId == account.RoleId && rp.Permission != null)
                .Select(rp => rp.Permission!.Code)
                .ToListAsync();

            var response = new AuthResponseDto
            {
                Permissions = permissions,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserDto
                {
                    Id = account.Id,
                    RoleId = account.RoleId,
                    RoleCode = account.Role?.Code ?? string.Empty,
                    Email = account.Email,
                    Username = account.Username,
                    Status = account.Status
                }
            };

            return response;
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var account = await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.RefreshToken == request.RefreshToken);

            if (account == null || account.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new AppException("Invalid or expired refresh token. Please login again.");

            var newAccessToken = GenerateJwtToken(account);
            var newRefreshToken = GenerateRefreshToken();

            account.RefreshToken = newRefreshToken;
            account.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            var response = new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                User = new UserDto
                {
                    Id = account.Id,
                    RoleId = account.RoleId,
                    RoleCode = account.Role?.Code ?? string.Empty,
                    Email = account.Email,
                    Username = account.Username,
                    Status = account.Status
                }
            };

            return response;
        }

        private string GenerateJwtToken(Account account)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, account.Username),
                new Claim(JwtRegisteredClaimNames.Email, account.Email),
                new Claim(ClaimTypes.Role, account.Role?.Code ?? string.Empty)
            };

            // Ép kiểu an toàn cho DurationInMinutes
            double duration = double.TryParse(jwtSettings["DurationInMinutes"], out var parsedDuration) ? parsedDuration : 60;

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
