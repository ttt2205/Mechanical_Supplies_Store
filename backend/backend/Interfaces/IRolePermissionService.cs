using backend.Domains.Entities;
using backend.Domains.Response;

namespace backend.Interfaces
{
    public interface IRolePermissionService
    {
        Task<List<Role>> GetAllRolesAsync();
        Task<Role> CreateRoleAsync(Role role);
        Task<Role> UpdateRoleAsync(int id, Role role);
        Task<bool> DeleteRoleAsync(int id);
        Task<Permission> CreatePermissionAsync(Permission permission);
        Task<List<Permission>> GetAllPermissionsAsync();
        Task<bool> AssignPermissionsToRoleAsync(int roleId, List<int> permissionIds);
        Task<List<string>> GetPermissionsForRoleAsync(int roleId);
    }
}
