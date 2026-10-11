namespace backend.Domains.Dtos.Account
{
    public class UpdateAccountDto
    {
        public int? RoleId { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Status { get; set; }
        public string? Password { get; set; }
    }
}
