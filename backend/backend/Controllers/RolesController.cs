using backend.Domains.Entities;
using backend.Interfaces;
using backend.Middleware;
using backend.Domains.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [RequirePermission("role:manage")]
    
    public class RolesController : ControllerBase
    {
        private readonly IRolePermissionService _rolePermissionService;

        public RolesController(IRolePermissionService rolePermissionService)
        {
            _rolePermissionService = rolePermissionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles() => Ok(ApiResponse<List<Role>>.SuccessResult(await _rolePermissionService.GetAllRolesAsync(), "Success"));

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] Role role) => Ok(ApiResponse<Role>.SuccessResult(await _rolePermissionService.CreateRoleAsync(role), "Success"));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] Role role) => Ok(ApiResponse<Role>.SuccessResult(await _rolePermissionService.UpdateRoleAsync(id, role), "Success"));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id) => Ok(ApiResponse<bool>.SuccessResult(await _rolePermissionService.DeleteRoleAsync(id), "Success"));

        [HttpGet("permissions")]
        public async Task<IActionResult> GetPermissions() => Ok(ApiResponse<List<Permission>>.SuccessResult(await _rolePermissionService.GetAllPermissionsAsync(), "Success"));

        [HttpPost("permissions")]
        public async Task<IActionResult> CreatePermission([FromBody] Permission permission) => Ok(ApiResponse<Permission>.SuccessResult(await _rolePermissionService.CreatePermissionAsync(permission), "Success"));

        [HttpPost("{roleId}/assign")]
        public async Task<IActionResult> AssignPermissions(int roleId, [FromBody] List<int> permissionIds) 
            => Ok(ApiResponse<bool>.SuccessResult(await _rolePermissionService.AssignPermissionsToRoleAsync(roleId, permissionIds), "Success"));

        [HttpGet("{roleId}/permissions")]
        public async Task<IActionResult> GetRolePermissions(int roleId)
            => Ok(ApiResponse<List<string>>.SuccessResult(await _rolePermissionService.GetPermissionsForRoleAsync(roleId), "Success"));
    }
}
