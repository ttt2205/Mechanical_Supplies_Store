namespace backend.Domains.Entities
{
    public class Permission : BaseEntity<int>
    {
        public string Code { get; set; } = string.Empty; // e.g. "product:create"
        public string Name { get; set; } = string.Empty; // e.g. "Create new product"
        public string? GroupName { get; set; } // e.g. "Product"
        
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }

    public class RolePermission
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        
        public Role? Role { get; set; }
        public Permission? Permission { get; set; }
    }

    public class RevokedToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime RevokedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiryDate { get; set; }
        public string? Reason { get; set; }
    }
}
