using System.Security.Claims;

namespace backend
{
    public interface IBasicService
    {
        int? CurrentUserId { get; }
        string? CurrentUserName { get; }
        string? CurrentUserRole { get; }
        ClaimsPrincipal? UserClaims { get; }
    }
}
