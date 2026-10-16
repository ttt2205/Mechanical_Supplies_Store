using backend.Common;
using backend.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net;

namespace backend.Middleware
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TokenValidationMiddleware> _logger;

        public TokenValidationMiddleware(RequestDelegate next, ILogger<TokenValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ICacheService cacheService)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                token = token.Replace("\"", "").Replace("'", "").Trim();
                var revokedKey = CacheKeyService.GetRevokedTokenKey(token);

                try
                {
                    if (await cacheService.ExistsAsync(revokedKey))
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        await context.Response.WriteAsync("Token has been revoked or expired.");
                        return;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Lỗi kiểm tra revoked token trong cache. Tiếp tục xử lý request.");
                }
            }

            await _next(context);
        }
    }
}
