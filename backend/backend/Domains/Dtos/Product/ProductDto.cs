namespace backend.Domains.Dtos.Product
{
    public class ProductDto
    {
        public long Id { get; set; }
        public int CategoryId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool IsContactPrice { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? SalePrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public int SoldCount { get; set; }
        public string? Brand { get; set; }
        public string? Origin { get; set; }
        public string? ShortDescription { get; set; }
        public string? Content { get; set; }
        public int StockQuantity { get; set; }
        public string? Unit { get; set; }
        public string? Thumbnail { get; set; }
        
        // You could add Image URL later by querying AttachmentMapping
    }
}
