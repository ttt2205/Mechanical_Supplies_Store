using System.ComponentModel.DataAnnotations;

namespace backend.Domains.Dtos.Post
{
    public class CreatePostDto
    {
        public int? CategoryId { get; set; }
        
        [Required]
        public string PostType { get; set; } = string.Empty;
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? Slug { get; set; }
        public string? Excerpt { get; set; }
        public string? Thumbnail { get; set; }
        public string Status { get; set; } = "PUBLISHED";
        
        public List<CreatePostSectionDto> Sections { get; set; } = new List<CreatePostSectionDto>();
    }

    public class CreatePostSectionDto
    {
        public string Heading { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; }
    }
}
