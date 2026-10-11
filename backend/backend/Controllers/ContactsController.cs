using backend.Data;
using backend.Domains.Dtos.Contact;
using backend.Domains.Entities;
using backend.Domains.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] CreateContactInquiryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<bool>.FailureResult("Invalid contact data"));
            }

            var inquiry = new ContactInquiry
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Service = dto.Service,
                Message = dto.Message,
                Status = "NEW",
                CreationTime = DateTime.UtcNow,
                IsDeleted = false
            };

            await _context.ContactInquiries.AddAsync(inquiry);
            await _context.SaveChangesAsync();

            var response = new ContactInquiryResponseDto
            {
                Id = inquiry.Id,
                FullName = inquiry.FullName,
                Phone = inquiry.Phone,
                Email = inquiry.Email,
                Service = inquiry.Service,
                Message = inquiry.Message,
                Status = inquiry.Status,
                CreationTime = inquiry.CreationTime
            };

            return Ok(ApiResponse<ContactInquiryResponseDto>.SuccessResult(response, "Inquiry submitted successfully"));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inquiries = await _context.ContactInquiries
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.CreationTime)
                .Select(x => new ContactInquiryResponseDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Phone = x.Phone,
                    Email = x.Email,
                    Service = x.Service,
                    Message = x.Message,
                    Status = x.Status,
                    CreationTime = x.CreationTime
                })
                .ToListAsync();

            return Ok(ApiResponse<List<ContactInquiryResponseDto>>.SuccessResult(inquiries, "Success"));
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] string status)
        {
            var inquiry = await _context.ContactInquiries.FindAsync(id);
            if (inquiry == null || inquiry.IsDeleted)
            {
                return NotFound(ApiResponse<bool>.FailureResult("Contact inquiry not found"));
            }

            inquiry.Status = status;
            inquiry.LastModificationTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<bool>.SuccessResult(true, "Status updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var inquiry = await _context.ContactInquiries.FindAsync(id);
            if (inquiry == null || inquiry.IsDeleted)
            {
                return NotFound(ApiResponse<bool>.FailureResult("Contact inquiry not found"));
            }

            inquiry.IsDeleted = true;
            inquiry.DeletionTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<bool>.SuccessResult(true, "Contact inquiry deleted successfully"));
        }
    }
}
