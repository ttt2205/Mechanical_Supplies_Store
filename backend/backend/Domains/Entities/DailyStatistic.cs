using System;

namespace backend.Domains.Entities
{
    public class DailyStatistic
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }          // Ngày thống kê (unique index)
        public int TotalViews { get; set; }          // Tổng view trong ngày
        public int NewUsers { get; set; }             // User đăng ký mới trong ngày
        public int NewOrders { get; set; }             // Đơn hàng mới trong ngày
        public decimal Revenue { get; set; }          // Doanh thu trong ngày
    }
}
