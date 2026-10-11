namespace backend.Domains.Entities
{
    public class Product : BaseEntity<long>
    {
        public int CategoryId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ActiveProductCode { get; set; } // Computed column
        public string? ActiveSlug { get; set; } // Computed column
        public bool IsFeatured { get; set; } = false;
        public bool IsContactPrice { get; set; } = false;
        public string? Unit { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? SalePrice { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public int ViewCount { get; set; } = 0;
        public int SoldCount { get; set; } = 0;
        public string? Brand { get; set; }
        public string? Origin { get; set; }
        public string? ShortDescription { get; set; }
        public string? Content { get; set; }
        public int StockQuantity { get; set; } = 0;
        public string? Thumbnail { get; set; }

        // Navigation properties
        public Category? Category { get; set; }
        public ICollection<ProductSection> Sections { get; set; } = new List<ProductSection>();
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }

    public class ProductSection : BaseEntity<long>
    {
        public long ProductId { get; set; }
        public string Heading { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; } = 0;

        public Product? Product { get; set; }
    }

    public class ProductVariant : BaseEntity<long>
    {
        public long ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string? ActiveSku { get; set; } // Computed column
        public string? Attributes { get; set; } // JSON
        public decimal? PriceOverride { get; set; }
        public int StockQuantity { get; set; } = 0;
        public bool IsDefault { get; set; } = false;
        public bool IsContactPrice { get; set; } = false;

        public Product? Product { get; set; }
    }
}
