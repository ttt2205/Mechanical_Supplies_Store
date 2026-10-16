using backend.Middleware;
using backend.Domains.Dtos.Account;
using backend.Domains.Entities;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [RequirePermission("user:manage")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("accounts")]
        public async Task<IActionResult> GetAccounts() 
        {
            var result = await _adminService.GetAllAccountsAsync();
            return Ok(ApiResponse<List<AccountResponseDto>>.SuccessResult(result, "Success"));
        }

        [HttpPost("accounts")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAccountByAdminAsync([FromBody] CreateAccountDto request)
        {
            await _adminService.CreateAccountAsync(request);
            return Ok(ApiResponse<object>.SuccessResult(null, "Account created successfully."));
        }

        [HttpPut("accounts/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto request) 
        {
            var result = await _adminService.UpdateAccountAsync(id, request);
            return Ok(ApiResponse<AccountResponseDto>.SuccessResult(result, "Success"));
        }

        [HttpDelete("accounts/{id}")]
        public async Task<IActionResult> DeleteAccount(int id) 
        {
            var result = await _adminService.DeleteAccountAsync(id);
            return Ok(ApiResponse<bool>.SuccessResult(result, "Success"));
        }
    }
}
