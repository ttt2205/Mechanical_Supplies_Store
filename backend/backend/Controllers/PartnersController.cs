using backend.Domains.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Domains.Response;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class PartnersController : ControllerBase
    {
        private readonly IPartnerService _partnerService;

        public PartnersController(IPartnerService partnerService)
        {
            _partnerService = partnerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _partnerService.GetAllPartnersAsync();
            return Ok(ApiResponse<List<Partner>>.SuccessResult(result, "Success"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Partner partner)
        {
            var result = await _partnerService.CreatePartnerAsync(partner);
            return Ok(ApiResponse<Partner>.SuccessResult(result, "Success"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Partner partner)
        {
            var result = await _partnerService.UpdatePartnerAsync(id, partner);
            return Ok(ApiResponse<Partner>.SuccessResult(result, "Success"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _partnerService.DeletePartnerAsync(id);
            return Ok(ApiResponse<bool>.SuccessResult(result, "Success"));
        }
    }
}
