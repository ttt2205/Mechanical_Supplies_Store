using System;

namespace backend.Domains.Dtos.Dashboard
{
    public class DashboardOverviewDto
    {
        public int TotalViews { get; set; }
        public int TotalViewsGrowthPercent { get; set; }   // So với kỳ trước
        public int NewUsers { get; set; }
        public int NewUsersGrowthPercent { get; set; }
        public int TotalActiveProducts { get; set; }
        public int TotalPosts { get; set; }
        public decimal TotalRevenue { get; set; }
        public int RevenueGrowthPercent { get; set; }
    }
}
