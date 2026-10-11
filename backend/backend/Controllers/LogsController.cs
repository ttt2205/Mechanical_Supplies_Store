using backend.Domains.Entities;
using backend.Domains.Response;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet("system")]
        public async Task<IActionResult> GetSystemLogs()
        {
            var result = await _logService.GetSystemLogsAsync();
            return Ok(ApiResponse<List<SystemLog>>.SuccessResult(result, "Success"));
        }

        [HttpGet("errors")]
        public async Task<IActionResult> GetSystemErrors()
        {
            var result = await _logService.GetSystemErrorsAsync();
            return Ok(ApiResponse<List<SystemError>>.SuccessResult(result, "Success"));
        }
    }
}
