namespace backend.Domains.Entities
{
    public class Category : BaseEntity<int>
    {
        public int? ParentId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? ActiveCode { get; set; } // Computed column
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ActiveSlug { get; set; } // Computed column
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public string Status { get; set; } = "ACTIVE";
        public string Type { get; set; } = "PRODUCT"; // PRODUCT, SERVICE, PARTNER
        
        // Navigation properties
        public Category? Parent { get; set; }
        public ICollection<Category> Children { get; set; } = new List<Category>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
