namespace backend.Domains.Entities
{
    public abstract class BaseEntity<TKey>
    {
        public TKey Id { get; set; } = default!;
        
        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
        public long? CreatorUserId { get; set; }
        
        public DateTime? LastModificationTime { get; set; }
        public long? LastModifierUserId { get; set; }
        
        public bool IsDeleted { get; set; } = false;
        public long? DeleterUserId { get; set; }
        public DateTime? DeletionTime { get; set; }
    }
}
