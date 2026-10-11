using backend.Data;
using backend.Domains.Dtos.Account;
using backend.Domains.Entities;
using backend.Domains.Response;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Account>> GetAllAccountsAsync()
        {
            var accounts = await _context.Accounts
                .Include(a => a.Role)
                .OrderByDescending(a => a.CreationTime)
                .ToListAsync();

            // Hide password hashes
            foreach (var a in accounts) {
                a.PasswordHash = "";
            }

            return accounts;
        }

        public async Task<Account> UpdateAccountAsync(int id, UpdateAccountDto accountDto)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                throw new AppException("Not found");

            if (accountDto.RoleId.HasValue) account.RoleId = accountDto.RoleId.Value;
            if (!string.IsNullOrEmpty(accountDto.Email)) account.Email = accountDto.Email;
            if (!string.IsNullOrEmpty(accountDto.FullName)) account.FullName = accountDto.FullName;
            if (!string.IsNullOrEmpty(accountDto.Phone)) account.Phone = accountDto.Phone;
            if (!string.IsNullOrEmpty(accountDto.Status)) account.Status = accountDto.Status;
            
            if (!string.IsNullOrEmpty(accountDto.Password)) {
                account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(accountDto.Password);
            }

            account.LastModificationTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            account.PasswordHash = "";

            return account;
        }

        public async Task<bool> DeleteAccountAsync(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                throw new AppException("Not found");

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task CreateAccountAsync(CreateAccountDto accountDto)
        {
            var roleExists = await _context.Roles.AnyAsync(r => r.Id == accountDto.RoleId);
            if (!roleExists)
                throw new NotFoundException($"Role id {accountDto.RoleId} not found.");

            var existingAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Username == accountDto.Username || a.Email == accountDto.Email);

            if (existingAccount != null)
                throw new AppException("Username or Email already exists.");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(accountDto.Password);

            var newAccount = new Account
            {
                RoleId = accountDto.RoleId,
                Username = accountDto.Username,
                PasswordHash = hashedPassword,
                Email = accountDto.Email,
                FullName = accountDto.FullName,
                Phone = accountDto.Phone,
                Status = accountDto.Status ?? "ACTIVE",
                CreationTime = DateTime.UtcNow,
                LastModificationTime = DateTime.UtcNow
            };

            await _context.Accounts.AddAsync(newAccount);
            await _context.SaveChangesAsync();
        }
    }
}
