using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domains.Entities
{
    public class Partner : BaseEntity<int>
    {
        public string Name { get; set; } = string.Empty;
        public string? Logo { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string Status { get; set; } = "ACTIVE";
    }

    public class SystemLog : BaseEntity<long>
    {
        public string Action { get; set; } = string.Empty;
        public string? Module { get; set; }
        public long? UserId { get; set; }
        public string? IPAddress { get; set; }
        public string? Details { get; set; }
    }

    public class SystemError : BaseEntity<long>
    {
        public string ErrorMessage { get; set; } = string.Empty;
        public string? StackTrace { get; set; }
        public string Level { get; set; } = "ERROR"; // WARNING, ERROR, CRITICAL
        public string? Source { get; set; }
        public string? Path { get; set; }
    }

    public class ContactInquiry : BaseEntity<long>
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Service { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = "NEW"; // NEW, CONTACTED, COMPLETED
    }
}
