using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Domains.Dtos.Dashboard;

namespace backend.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardOverviewDto> GetOverviewAsync(DateOnly from, DateOnly to);
        Task<List<TimeSeriesPointDto>> GetTimeSeriesAsync(DateOnly from, DateOnly to);
        Task<List<TopItemDto>> GetTopProductsAsync(int top = 5);
        Task<List<TopItemDto>> GetTopPostsAsync(int top = 5);
    }
}
