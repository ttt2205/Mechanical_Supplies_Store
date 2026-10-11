namespace backend.Domains.Entities
{
    public class Account
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string Status { get; set; } = "ACTIVE"; 
        
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiryTime { get; set; }

        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
        public DateTime LastModificationTime { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Role? Role { get; set; }
    }
}
