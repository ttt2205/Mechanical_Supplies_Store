using System;

namespace backend.Domains.Dtos.Dashboard
{
    public class TimeSeriesPointDto
    {
        public DateOnly Date { get; set; }
        public int Views { get; set; }
        public int NewUsers { get; set; }
        public decimal Revenue { get; set; }
    }
}
