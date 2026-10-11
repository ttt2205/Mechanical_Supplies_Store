using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class TokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<TokenCleanupService> _logger;

        public TokenCleanupService(IServiceProvider serviceProvider, ILogger<TokenCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("TokenCleanupService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupTokensAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing Token Cleanup.");
                }

                // Run every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }

            _logger.LogInformation("TokenCleanupService is stopping.");
        }

        private async Task CleanupTokensAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;
            
            _logger.LogInformation("Starting token cleanup at: {time}", now);

            // ExecuteDeleteAsync is highly optimized in EF Core 7+ and runs directly on the database
            var deletedCount = await context.RevokedTokens
                .Where(t => t.ExpiryDate < now)
                .ExecuteDeleteAsync(stoppingToken);

            _logger.LogInformation("Token cleanup completed. Deleted {count} expired tokens.", deletedCount);
        }
    }
}
