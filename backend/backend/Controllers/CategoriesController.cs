using backend.Domains.Dtos.Category;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories([FromQuery] string? type)
        {
            var result = await _categoryService.GetAllCategoriesAsync(type);
            return Ok(ApiResponse<List<CategoryDto>>.SuccessResult(result, "Category fetched successfully"));
        }

        [HttpPost]
        [Authorize]
        [backend.Middleware.RequirePermission("category:create")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
        {
            var result = await _categoryService.CreateCategoryAsync(dto);
            return Ok(ApiResponse<CategoryDto>.SuccessResult(result, "Categories fetched successfully"));
        }

        [HttpPut("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("category:update")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto dto)
        {
            var result = await _categoryService.UpdateCategoryAsync(id, dto);
            return Ok(ApiResponse<CategoryDto>.SuccessResult(result, "Category updated successfully"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("category:delete")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            return Ok(ApiResponse<bool>.SuccessResult(result, "Category deleted successfully"));
        }
    }
}
