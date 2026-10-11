using Microsoft.AspNetCore.Authorization;
using backend.Domains.Dtos.Product;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? search = null)
        {
            var result = await _productService.GetAllProductsAsync(page, limit, search);
            return Ok(ApiResponse<List<ProductDto>>.SuccessResult(result, "Products fetched successfully"));
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var result = await _productService.GetProductBySlugAsync(slug);
            return Ok(ApiResponse<ProductDto>.SuccessResult(result, "Product details fetched successfully"));
        }

        [HttpPost]
        [Authorize]
        [backend.Middleware.RequirePermission("product:create")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto dto)
        {
            return Ok(ApiResponse<ProductDto>.SuccessResult(await _productService.CreateProductAsync(dto), "Product created successfully"));
        }

        [HttpPut("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("product:update")]
        public async Task<IActionResult> UpdateProduct(long id, [FromBody] ProductDto dto)
        {
            return Ok(ApiResponse<ProductDto>.SuccessResult(await _productService.UpdateProductAsync(id, dto), "Product updated successfully"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("product:delete")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            return Ok(ApiResponse<bool>.SuccessResult(await _productService.DeleteProductAsync(id), "Product deleted successfully"));
        }

        [HttpPost("{slug}/view")]
        // No [Authorize] required since any visitor can view and increment count
        public async Task<IActionResult> IncrementViewCount(string slug)
        {
            var result = await _productService.IncrementViewCountAsync(slug);
            return Ok(ApiResponse<bool>.SuccessResult(result, "View count increased successfully"));
        }
    }
}
