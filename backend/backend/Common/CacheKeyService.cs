namespace backend.Common
{
    public static class CacheKeyService
    {
        public static string GetRolePermissionsKey(string roleId) => $"role_permissions:{roleId}";
        public static string GetUserPermissionsKey(long userId) => $"user_permissions:{userId}";
        public static string GetRevokedTokenKey(string token) => $"revoked_token:{token}";
        public static string GetIpRateLimitKey(string ip) => $"rate_limit_ip:{ip}";
        public static string GetIpBlacklistKey(string ip) => $"blacklisted_ip:{ip}";
    }
}
