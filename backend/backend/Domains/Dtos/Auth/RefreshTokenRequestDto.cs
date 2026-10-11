using System.ComponentModel.DataAnnotations;

namespace backend.Domains.Dtos.Auth
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
