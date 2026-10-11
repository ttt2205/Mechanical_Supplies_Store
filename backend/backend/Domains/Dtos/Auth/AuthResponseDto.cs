namespace backend.Domains.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public UserDto User { get; set; } = new UserDto();
        public List<string> Permissions { get; set; } = new List<string>();
    }

    public class UserDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string RoleCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
