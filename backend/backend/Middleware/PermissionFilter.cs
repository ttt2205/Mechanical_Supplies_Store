using backend.Common;
using backend.Data;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace backend.Middleware
{
    public class PermissionFilter : IAsyncAuthorizationFilter
    {
        private readonly string _permission;
        private readonly ICacheService _cacheService;
        private readonly ApplicationDbContext _context;

        public PermissionFilter(string permission, ICacheService cacheService, ApplicationDbContext context)
        {
            _permission = permission;
            _cacheService = cacheService;
            _context = context;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var hasAllowAnonymous = context.ActionDescriptor.EndpointMetadata
                .Any(em => em.GetType() == typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute));

            if (hasAllowAnonymous)
                return;

            var user = context.HttpContext.User;

            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var roleClaim = user.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim))
            {
                context.Result = new ForbidResult();
                return;
            }

            // Admin always has all permissions
            if (roleClaim.Equals("admin", StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            // Check cache for role permissions
            var cacheKey = CacheKeyService.GetRolePermissionsKey(roleClaim);
            var cachedPermissions = await _cacheService.GetAsync<List<string>>(cacheKey);

            if (cachedPermissions == null)
            {
                // Fetch from DB if not in cache
                cachedPermissions = await _context.RolePermissions
                    .Include(rp => rp.Permission)
                    .Include(rp => rp.Role)
                    .Where(rp => rp.Role!.Code == roleClaim)
                    .Select(rp => rp.Permission!.Code)
                    .ToListAsync();

                // Cache for 1 hour
                await _cacheService.SetAsync(cacheKey, cachedPermissions, TimeSpan.FromHours(1));
            }

            if (!cachedPermissions.Contains(_permission))
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
