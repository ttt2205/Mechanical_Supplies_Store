namespace backend.Domains.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // e.g. "admin", "customer"
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsAdmin { get; set; } = false;
        
        // Navigation properties
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
    }
}
