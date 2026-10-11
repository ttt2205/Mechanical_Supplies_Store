using backend.Domains.Entities;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Exceptions;

namespace backend.Services
{
    public interface IPartnerService
    {
        Task<List<Partner>> GetAllPartnersAsync();
        Task<Partner> CreatePartnerAsync(Partner partner);
        Task<Partner> UpdatePartnerAsync(int id, Partner partner);
        Task<bool> DeletePartnerAsync(int id);
    }

    public class PartnerService : IPartnerService
    {
        private readonly ApplicationDbContext _context;

        public PartnerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Partner>> GetAllPartnersAsync()
        {
            var partners = await _context.Partners
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreationTime)
                .ToListAsync();

            return partners;
        }

        public async Task<Partner> CreatePartnerAsync(Partner partner)
        {
            partner.CreationTime = DateTime.UtcNow;
            await _context.Partners.AddAsync(partner);
            await _context.SaveChangesAsync();
            return partner;
        }

        public async Task<Partner> UpdatePartnerAsync(int id, Partner partner)
        {
            var existing = await _context.Partners.FindAsync(id);
            if (existing == null || existing.IsDeleted)
                throw new AppException("Not found");

            existing.Name = partner.Name;
            existing.Logo = partner.Logo;
            existing.Phone = partner.Phone;
            existing.Email = partner.Email;
            existing.Address = partner.Address;
            existing.Status = partner.Status;
            existing.LastModificationTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeletePartnerAsync(int id)
        {
            var existing = await _context.Partners.FindAsync(id);
            if (existing == null)
                throw new AppException("Not found");

            existing.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
