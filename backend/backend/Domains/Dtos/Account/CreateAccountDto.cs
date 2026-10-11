using System.ComponentModel.DataAnnotations;

namespace backend.Domains.Dtos.Account
{
    public class CreateAccountDto
    {
        [Required(ErrorMessage = "RoleId cannot be empty.")]
        public int RoleId { get; set; }

        [Required(ErrorMessage = "Username cannot be empty.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password cannot be empty.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email cannot be empty.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        [StringLength(255, ErrorMessage = "Email must not exceed 255 characters.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(255, ErrorMessage = "Full name must not exceed 255 characters.")]
        public string? FullName { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format.")]
        [StringLength(50, ErrorMessage = "Phone number must not exceed 50 characters.")]
        public string? Phone { get; set; }

        public string Status { get; set; } = "ACTIVE";
    }
}
