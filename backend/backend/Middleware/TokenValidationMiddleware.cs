using backend.Common;
using backend.Interfaces;
using System.Net;

namespace backend.Middleware
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ICacheService cacheService)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                var revokedKey = CacheKeyService.GetRevokedTokenKey(token);

                if (await cacheService.ExistsAsync(revokedKey))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.WriteAsync("Token has been revoked or expired.");
                    return;
                }
            }

            await _next(context);
        }
    }
}
