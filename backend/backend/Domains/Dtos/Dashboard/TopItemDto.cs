using System;

namespace backend.Domains.Dtos.Dashboard
{
    public class TopItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public int ViewCount { get; set; }
        public decimal? Price { get; set; }
    }
}
