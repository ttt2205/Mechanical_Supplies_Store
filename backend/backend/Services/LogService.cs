using backend.Domains.Entities;
using backend.Data;
using backend.Domains.Response;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface ILogService
    {
        Task<List<SystemLog>> GetSystemLogsAsync();
        Task<List<SystemError>> GetSystemErrorsAsync();
        Task LogErrorAsync(SystemError error);
        Task LogActionAsync(SystemLog log);
    }

    public class LogService : ILogService
    {
        private readonly ApplicationDbContext _context;

        public LogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SystemLog>> GetSystemLogsAsync()
        {
            var logs = await _context.SystemLogs
                .OrderByDescending(l => l.CreationTime)
                .Take(100)
                .ToListAsync();
            return logs;
        }

        public async Task<List<SystemError>> GetSystemErrorsAsync()
        {
            var errors = await _context.SystemErrors
                .OrderByDescending(e => e.CreationTime)
                .Take(100)
                .ToListAsync();
            return errors;
        }

        public async Task LogErrorAsync(SystemError error)
        {
            error.CreationTime = DateTime.UtcNow;
            await _context.SystemErrors.AddAsync(error);
            await _context.SaveChangesAsync();
        }

        public async Task LogActionAsync(SystemLog log)
        {
            log.CreationTime = DateTime.UtcNow;
            await _context.SystemLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
