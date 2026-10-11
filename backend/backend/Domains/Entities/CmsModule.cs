using System.ComponentModel.DataAnnotations.Schema;
﻿namespace backend.Domains.Entities
{
    public class PostCategory : BaseEntity<int>
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ActiveSlug { get; set; } // Computed column
        
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }

    public class Post : BaseEntity<long>
    {
        public int? CategoryId { get; set; }
        public string PostType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ActiveSlug { get; set; } // Computed column
        public string? Excerpt { get; set; }
        public int? AuthorId { get; set; }
        public string Status { get; set; } = "PUBLISHED";
        public string? Thumbnail { get; set; }

        // Navigation properties
        public PostCategory? Category { get; set; }
        public Account? Author { get; set; }
        public ICollection<PostSection> Sections { get; set; } = new List<PostSection>();
        public PostStatistics? Statistics { get; set; }
    }

    public class PostSection : BaseEntity<long>
    {
        public long PostId { get; set; }
        public string Heading { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; } = 0;

        public Post? Post { get; set; }
    }

    public class PostStatistics
    {
        public long PostId { get; set; }
        public long ViewCount { get; set; } = 0;
        public int ShareCount { get; set; } = 0;
        public DateTime? LastViewedAt { get; set; }

        public Post? Post { get; set; }
    }
}
