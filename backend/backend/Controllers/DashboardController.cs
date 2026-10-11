using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Domains.Dtos.Dashboard;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/dashboard")]
    [Authorize]
    // Consider adding [RequirePermission] if there is a specific permission for dashboard
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;
        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
        {
            var toDate = to ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var fromDate = from ?? toDate.AddDays(-29); // mặc định 30 ngày gần nhất
            var result = await _service.GetOverviewAsync(fromDate, toDate);
            return Ok(ApiResponse<DashboardOverviewDto>.SuccessResult(result, "Success"));
        }

        [HttpGet("timeseries")]
        public async Task<IActionResult> GetTimeSeries([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
        {
            var toDate = to ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var fromDate = from ?? toDate.AddDays(-29);
            var result = await _service.GetTimeSeriesAsync(fromDate, toDate);
            return Ok(ApiResponse<List<TimeSeriesPointDto>>.SuccessResult(result, "Success"));
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts([FromQuery] int top = 5)
        {
            var result = await _service.GetTopProductsAsync(top);
            return Ok(ApiResponse<List<TopItemDto>>.SuccessResult(result, "Success"));
        }

        [HttpGet("top-posts")]
        public async Task<IActionResult> GetTopPosts([FromQuery] int top = 5)
        {
            var result = await _service.GetTopPostsAsync(top);
            return Ok(ApiResponse<List<TopItemDto>>.SuccessResult(result, "Success"));
        }
    }
}
