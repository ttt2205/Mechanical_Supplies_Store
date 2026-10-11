using System.ComponentModel.DataAnnotations;

namespace backend.Domains.Dtos.Contact
{
    public class CreateContactInquiryDto
    {
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(150, ErrorMessage = "Full name cannot exceed 150 characters")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(50, ErrorMessage = "Phone number cannot exceed 50 characters")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters")]
        public string? Email { get; set; }

        [StringLength(100, ErrorMessage = "Service cannot exceed 100 characters")]
        public string? Service { get; set; }

        public string? Message { get; set; }
    }

    public class ContactInquiryResponseDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Service { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = "NEW";
        public DateTime CreationTime { get; set; }
    }
}
