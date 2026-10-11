using backend.Common;
using backend.Data;
using backend.Domains.Entities;
using backend.Domains.Response;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public RolePermissionService(ApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<List<Role>> GetAllRolesAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return roles;
        }

        public async Task<Role> UpdateRoleAsync(int id, Role role)
        {
            var existing = await _context.Roles.FindAsync(id);
            if (existing == null) throw new AppException("Role not found");
            if (existing.IsAdmin || existing.Code.Equals("ADMIN", StringComparison.OrdinalIgnoreCase))
            {
                throw new AppException("Vai trò Quản trị viên (Admin) là hệ thống cố định, không được phép chỉnh sửa.");
            }
            existing.Name = role.Name;
            existing.Code = role.Code?.ToUpper() ?? string.Empty;
            existing.Description = role.Description;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var existing = await _context.Roles.FindAsync(id);
            if (existing == null) throw new AppException("Role not found");
            if (existing.IsAdmin || existing.Code.Equals("ADMIN", StringComparison.OrdinalIgnoreCase))
            {
                throw new AppException("Vai trò Quản trị viên (Admin) là hệ thống cố định, không được phép xóa.");
            }
            _context.Roles.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Role> CreateRoleAsync(Role role)
        {
            if (!string.IsNullOrEmpty(role.Code))
            {
                role.Code = role.Code.ToUpper();
            }

            if (await _context.Roles.AnyAsync(r => r.Code == role.Code))
                throw new AppException("Role Code already exists");

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<Permission> CreatePermissionAsync(Permission permission)
        {
            if (await _context.Permissions.AnyAsync(p => p.Code == permission.Code))
                throw new AppException("Permission code exists");

            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();
            return permission;
        }

        public async Task<List<Permission>> GetAllPermissionsAsync()
        {
            var permissions = await _context.Permissions.ToListAsync();
            return permissions;
        }

        public async Task<bool> AssignPermissionsToRoleAsync(int roleId, List<int> permissionIds)
        {
            var role = await _context.Roles.FindAsync(roleId);
            if (role == null) throw new AppException("Role not found");

            if (role.IsAdmin || role.Code.Equals("ADMIN", StringComparison.OrdinalIgnoreCase))
            {
                throw new AppException("Quyền hạn của tài khoản Admin là cố định (toàn quyền) và không được phép chỉnh sửa.");
            }

            var currentPermissions = await _context.RolePermissions.Where(rp => rp.RoleId == roleId).ToListAsync();
            _context.RolePermissions.RemoveRange(currentPermissions);

            foreach (var pId in permissionIds)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = pId });
            }

            await _context.SaveChangesAsync();

            // Invalidate Cache
            var cacheKey = CacheKeyService.GetRolePermissionsKey(role.Code);
            await _cacheService.RemoveAsync(cacheKey);

            return true;
        }

        public async Task<List<string>> GetPermissionsForRoleAsync(int roleId)
        {
            var role = await _context.Roles.FindAsync(roleId);
            if (role != null && (role.IsAdmin || role.Code.Equals("ADMIN", StringComparison.OrdinalIgnoreCase)))
            {
                // Admin has everything
                return await _context.Permissions.Select(p => p.Code).ToListAsync();
            }

            return await _context.RolePermissions
                .Include(rp => rp.Permission)
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission!.Code)
                .ToListAsync();
        }
    }
}
