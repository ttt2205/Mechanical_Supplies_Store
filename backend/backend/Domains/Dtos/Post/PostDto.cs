namespace backend.Domains.Dtos.Post
{
    public class PostDto
    {
        public long Id { get; set; }
        public int? CategoryId { get; set; }
        public string PostType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? Thumbnail { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreationTime { get; set; }
        
        public List<PostSectionDto> Sections { get; set; } = new List<PostSectionDto>();
    }

    public class PostSectionDto
    {
        public long? Id { get; set; }
        public string Heading { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; }
    }
}
