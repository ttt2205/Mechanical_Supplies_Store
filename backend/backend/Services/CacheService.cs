using backend.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace backend.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<CacheService> _logger;

        public CacheService(IDistributedCache cache, ILogger<CacheService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            try
            {
                var value = await _cache.GetStringAsync(key);
                if (value == null) return default;
                return JsonSerializer.Deserialize<T>(value);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Cache GetAsync thất bại cho key '{Key}'. Trả về null để fallback truy vấn cơ sở dữ liệu.", key);
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expirationTime = null)
        {
            try
            {
                var options = new DistributedCacheEntryOptions();
                if (expirationTime.HasValue)
                {
                    options.SetAbsoluteExpiration(expirationTime.Value);
                }

                var serializedValue = JsonSerializer.Serialize(value);
                await _cache.SetStringAsync(key, serializedValue, options);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Cache SetAsync thất bại cho key '{Key}'. Bỏ qua ghi cache.", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _cache.RemoveAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Cache RemoveAsync thất bại cho key '{Key}'.", key);
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                var value = await _cache.GetStringAsync(key);
                return value != null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Cache ExistsAsync thất bại cho key '{Key}'. Mặc định trả về false.", key);
                return false;
            }
        }
    }
}
