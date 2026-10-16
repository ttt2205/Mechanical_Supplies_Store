namespace backend.Domains.Dtos.Account
{
    public class AccountRoleDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsAdmin { get; set; }
    }

    public class AccountResponseDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public DateTime CreationTime { get; set; }
        public DateTime LastModificationTime { get; set; }
        public AccountRoleDto? Role { get; set; }
    }
}
