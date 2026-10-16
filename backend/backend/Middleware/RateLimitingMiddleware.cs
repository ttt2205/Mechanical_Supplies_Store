using System.Net;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StackExchange.Redis; // Bắt buộc để dùng StringIncrementAsync nguyên tử

namespace backend.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private readonly IConnectionMultiplexer? _redis;

        public RateLimitingMiddleware(
            RequestDelegate next,
            IConfiguration configuration,
            ILogger<RateLimitingMiddleware> logger,
            IConnectionMultiplexer? redis = null) // Tiêm Redis Multiplexer
        {
            _next = next;
            _configuration = configuration;
            _logger = logger;
            _redis = redis;
        }

        public async Task InvokeAsync(HttpContext context, IDistributedCache cache)
        {
            // 1. Lấy IP thực (Ưu tiên header từ Proxy/Load Balancer)
            var ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                            ?? context.Connection.RemoteIpAddress?.ToString();

            if (string.IsNullOrEmpty(ipAddress))
            {
                await _next(context);
                return;
            }

            try
            {
                var maxRequests = _configuration.GetValue<int>("RateLimit:MaxRequestsPerMinute", 100);
                var blockDuration = _configuration.GetValue<int>("RateLimit:BlockDurationMinutes", 15);

                // 2. Kiểm tra Blacklist ngay lập tức
                var blacklistKey = $"IpBlacklist:{ipAddress}";
                var isBlacklisted = await cache.GetStringAsync(blacklistKey);
                if (!string.IsNullOrEmpty(isBlacklisted))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    await context.Response.WriteAsync("Your IP has been temporarily blocked due to too many requests.");
                    return;
                }

                // 3. Tạo Cache Key theo phút để xử lý triệt để lỗi "Sliding expiration" (Fixed Window)
                var currentMinute = DateTime.UtcNow.ToString("yyyyMMddHHmm");
                var rateLimitKey = $"IpRateLimit:{ipAddress}:{currentMinute}";
                long requestCount = 0;

                // 4. Xử lý đếm nguyên tử bằng Redis (Atomic Increment) nếu có kết nối
                if (_redis != null && _redis.IsConnected)
                {
                    var db = _redis.GetDatabase();
                    requestCount = await db.StringIncrementAsync(rateLimitKey); // Tự động tăng và trả về giá trị mới, an toàn đa luồng

                    if (requestCount == 1)
                    {
                        // Chỉ set TTL ở request đầu tiên trong phút
                        await db.KeyExpireAsync(rateLimitKey, TimeSpan.FromMinutes(2));
                    }
                }
                else
                {
                    // Fallback nếu chưa cấu hình Redis Multiplexer (Vẫn loại bỏ được lỗi trượt thời gian)
                    var countStr = await cache.GetStringAsync(rateLimitKey);
                    _ = long.TryParse(countStr, out requestCount);
                    requestCount++;

                    await cache.SetStringAsync(rateLimitKey, requestCount.ToString(), new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
                    });
                }

                // 5. Kiểm tra và khóa Blacklist nếu vượt ngưỡng
                if (requestCount > maxRequests)
                {
                    await cache.SetStringAsync(blacklistKey, "blocked", new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(blockDuration)
                    });

                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    await context.Response.WriteAsync("Rate limit exceeded. Your IP is blocked.");
                    return;
                }
            }
            catch (Exception ex)
            {
                // Khi Redis hoặc Cache gặp sự cố kết nối, ghi log cảnh báo và cho request đi tiếp bình thường
                _logger.LogWarning(ex, "RateLimitingMiddleware gặp lỗi cache/Redis. Bỏ qua kiểm tra rate limit cho IP {IpAddress}.", ipAddress);
            }

            await _next(context);
        }
    }
}