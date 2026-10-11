using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Domains.Dtos.Dashboard;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _db;

        public DashboardService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<DashboardOverviewDto> GetOverviewAsync(DateOnly from, DateOnly to)
        {
            var rangeDays = to.DayNumber - from.DayNumber + 1;
            var prevFrom = from.AddDays(-rangeDays);
            var prevTo = from.AddDays(-1);

            var current = await _db.DailyStatistics
                .Where(x => x.Date >= from && x.Date <= to)
                .GroupBy(x => 1)
                .Select(g => new {
                    Views = g.Sum(x => x.TotalViews),
                    Users = g.Sum(x => x.NewUsers),
                    Revenue = g.Sum(x => x.Revenue)
                }).FirstOrDefaultAsync();

            var previous = await _db.DailyStatistics
                .Where(x => x.Date >= prevFrom && x.Date <= prevTo)
                .GroupBy(x => 1)
                .Select(g => new {
                    Views = g.Sum(x => x.TotalViews),
                    Users = g.Sum(x => x.NewUsers),
                    Revenue = g.Sum(x => x.Revenue)
                }).FirstOrDefaultAsync();

            int GrowthPercent(int cur, int prev) => prev == 0 ? 0 : (int)Math.Round((cur - prev) * 100.0 / prev);

            return new DashboardOverviewDto
            {
                TotalViews = current?.Views ?? 0,
                TotalViewsGrowthPercent = GrowthPercent(current?.Views ?? 0, previous?.Views ?? 0),
                NewUsers = current?.Users ?? 0,
                NewUsersGrowthPercent = GrowthPercent(current?.Users ?? 0, previous?.Users ?? 0),
                TotalActiveProducts = await _db.Products.CountAsync(p => p.Status == "ACTIVE"),
                TotalPosts = await _db.Posts.CountAsync(p => p.Status == "PUBLISHED"),
                TotalRevenue = current?.Revenue ?? 0,
                RevenueGrowthPercent = GrowthPercent((int)(current?.Revenue ?? 0), (int)(previous?.Revenue ?? 0))
            };
        }

        public async Task<List<TimeSeriesPointDto>> GetTimeSeriesAsync(DateOnly from, DateOnly to)
        {
            return await _db.DailyStatistics
                .Where(x => x.Date >= from && x.Date <= to)
                .OrderBy(x => x.Date)
                .Select(x => new TimeSeriesPointDto
                {
                    Date = x.Date,
                    Views = x.TotalViews,
                    NewUsers = x.NewUsers,
                    Revenue = x.Revenue
                }).ToListAsync();
        }

        public async Task<List<TopItemDto>> GetTopProductsAsync(int top = 5)
        {
            return await _db.Products
                .Where(p => p.Status == "ACTIVE")
                .OrderByDescending(p => p.ViewCount)
                .Take(top)
                .Select(p => new TopItemDto
                {
                    Id = (int)p.Id,
                    Name = p.Name,
                    ImageUrl = p.Thumbnail,
                    ViewCount = p.ViewCount,
                    Price = p.SalePrice ?? p.BasePrice
                }).ToListAsync();
        }

        public async Task<List<TopItemDto>> GetTopPostsAsync(int top = 5)
        {
            return await _db.PostStatistics
                .OrderByDescending(x => x.ViewCount)
                .Take(top)
                .Select(x => new TopItemDto
                {
                    Id = (int)x.PostId,
                    Name = x.Post!.Title,
                    ImageUrl = x.Post.Thumbnail,
                    ViewCount = (int)x.ViewCount,
                    Price = null
                }).ToListAsync();
        }
    }
}
