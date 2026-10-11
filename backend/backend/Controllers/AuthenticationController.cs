using backend.Domains.Dtos.Auth;
using backend.Domains.Response;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Đăng ký thành công."));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Đăng nhập thành công."));
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Tạm thời chưa có logic logout cụ thể (ví dụ: blacklist token)
            return Ok(ApiResponse<object>.SuccessResult(null, "Đăng xuất thành công."));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto? request)
        {
            if (string.IsNullOrEmpty(request?.RefreshToken))
                throw new AppException("Refresh token không được để trống."); // Ném ra Exception để middleware xử lý thành lỗi 400

            var result = await _authService.RefreshTokenAsync(request);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Làm mới token thành công."));
        }
    }
}
