using System.Security.Claims;

namespace backend
{
    public class BasicService : IBasicService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected BasicService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public ClaimsPrincipal? UserClaims => _httpContextAccessor.HttpContext?.User;
        public int? CurrentUserId
        {
            get
            {
                var userIdClaim = UserClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return int.TryParse(userIdClaim, out int userId) ? userId : null;
            }
        }

        public string? CurrentUserName => UserClaims?.FindFirst(ClaimTypes.Name)?.Value;

        public string? CurrentUserRole => UserClaims?.FindFirst(ClaimTypes.Role)?.Value;
    }
}
