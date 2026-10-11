namespace backend.Domains.Entities
{
    public class AttachmentSyntax : BaseEntity<int>
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string SyntaxPath { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = false;
        public string SyntaxName { get; set; } = string.Empty;
    }

    public class Attachment : BaseEntity<int>
    {
        public int? TenantId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string DiskFileName { get; set; } = string.Empty;
        public int FileSize { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public string DiskDirectory { get; set; } = string.Empty;
        public string? ConvertFileName { get; set; }
        public string? ConvertDiskDirectory { get; set; }
        public long? AuthorId { get; set; }
        public int? Version { get; set; }
    }

    public class AttachmentMapping
    {
        public long Id { get; set; }
        public int AttachmentId { get; set; }
        public string ObjectId { get; set; } = string.Empty;
        public string ObjectType { get; set; } = string.Empty;
        public string SyntaxCode { get; set; } = string.Empty;
        public int Order { get; set; } = 0;
        public bool IsCurrent { get; set; } = true;
        
        // Navigation properties
        public Attachment? Attachment { get; set; }
        public AttachmentSyntax? Syntax { get; set; }
    }
}
