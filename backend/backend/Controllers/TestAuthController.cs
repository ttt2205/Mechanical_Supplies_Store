using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestAuthController : ControllerBase
    {
        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            return Ok(new
            {
                HasAuthHeader = !string.IsNullOrEmpty(authHeader),
                HeaderPrefix = authHeader?.Substring(0, Math.Min(authHeader.Length, 15)),
                IsAuthenticated = User.Identity?.IsAuthenticated,
                Name = User.Identity?.Name,
                Claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }

        [HttpGet("secure")]
        [Authorize]
        public IActionResult SecureEndpoint()
        {
            return Ok(new { Message = "You are authorized!", User = User.Identity?.Name });
        }
    }
}
