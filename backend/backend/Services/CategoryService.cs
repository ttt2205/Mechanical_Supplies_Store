using backend.Data;
using backend.Domains.Dtos.Category;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Constants.Cache;
using backend.Enums;

namespace backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public CategoryService(ApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<List<CategoryDto>> GetAllCategoriesAsync(string? type = null)
        {
            string cacheKey = string.IsNullOrWhiteSpace(type) 
                ? CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories) 
                : $"{CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories)}:type:{type.Trim().ToUpper()}";

            var categories = await _cacheService.GetAsync<List<CategoryDto>>(cacheKey);

            if (categories == null)
            {
                var query = _context.Categories.Where(c => !c.IsDeleted);

                if (!string.IsNullOrWhiteSpace(type))
                {
                    var normalizedType = type.Trim().ToUpper();
                    query = query.Where(c => c.Type == normalizedType);
                }

                categories = await query
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        ParentId = c.ParentId,
                        Code = c.Code,
                        Name = c.Name,
                        Slug = c.Slug,
                        Type = c.Type,
                        Icon = c.Icon,
                        Status = c.Status,
                        Description = c.Description,
                        DisplayOrder = c.DisplayOrder
                    })
                    .OrderBy(c => c.DisplayOrder)
                    .ToListAsync();

                if (categories != null)
                {
                    await _cacheService.SetAsync(cacheKey, categories, TimeSpan.FromMinutes(60));
                }
            }
            return categories ?? new List<CategoryDto>();
        }

        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto dto)
        {
            if (!dto.ParentId.HasValue || dto.ParentId.Value <= 0)
            {
                throw new backend.Exceptions.AppException("Vui lòng chọn danh mục cha tương ứng. Các danh mục tạo mới bắt buộc phải thuộc một danh mục cha.");
            }

            var parentCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == dto.ParentId.Value && !c.IsDeleted);

            if (parentCategory == null)
            {
                throw new backend.Exceptions.NotFoundException("Danh mục cha không tồn tại hoặc đã bị xóa.");
            }

            var categoryType = string.IsNullOrWhiteSpace(dto.Type) 
                ? parentCategory.Type 
                : dto.Type.Trim().ToUpper();

            if (parentCategory.Type != categoryType)
            {
                throw new backend.Exceptions.AppException($"Danh mục cha '{parentCategory.Name}' thuộc nhóm '{parentCategory.Type}', không khớp với nhóm '{categoryType}'.");
            }

            var normalizedCode = dto.Code.Trim();
            if (await _context.Categories.AnyAsync(c => !c.IsDeleted && c.Code == normalizedCode))
            {
                throw new backend.Exceptions.AppException($"Mã danh mục '{normalizedCode}' đã tồn tại.");
            }

            var category = new backend.Domains.Entities.Category
            {
                ParentId = dto.ParentId.Value,
                Code = normalizedCode,
                Name = dto.Name.Trim(),
                Slug = string.IsNullOrWhiteSpace(dto.Slug) ? normalizedCode.ToLower() : dto.Slug.Trim(),
                Type = categoryType,
                Description = dto.Description,
                Icon = dto.Icon,
                DisplayOrder = dto.DisplayOrder,
                Status = dto.Status ?? "ACTIVE",
                CreationTime = DateTime.UtcNow,
                LastModificationTime = DateTime.UtcNow
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            await ClearCategoryCachesAsync();
            dto.Id = category.Id;
            dto.Type = category.Type;
            return dto;
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, CategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null || category.IsDeleted) 
                throw new backend.Exceptions.NotFoundException("Danh mục không tồn tại");

            var categoryType = string.IsNullOrWhiteSpace(dto.Type) 
                ? category.Type 
                : dto.Type.Trim().ToUpper();

            // Nếu là danh mục con, bắt buộc phải có ParentId
            if (category.ParentId != null)
            {
                if (!dto.ParentId.HasValue || dto.ParentId.Value <= 0)
                {
                    throw new backend.Exceptions.AppException("Danh mục này bắt buộc phải chọn danh mục cha tương ứng.");
                }

                if (dto.ParentId.Value == id)
                {
                    throw new backend.Exceptions.AppException("Danh mục không thể tự làm danh mục cha của chính nó.");
                }

                var parentCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Id == dto.ParentId.Value && !c.IsDeleted);
                if (parentCategory == null)
                {
                    throw new backend.Exceptions.NotFoundException("Danh mục cha không tồn tại hoặc đã bị xóa.");
                }

                if (parentCategory.Type != categoryType)
                {
                    throw new backend.Exceptions.AppException($"Danh mục cha '{parentCategory.Name}' thuộc nhóm '{parentCategory.Type}', không khớp với nhóm '{categoryType}'.");
                }

                category.ParentId = dto.ParentId.Value;
            }
            else
            {
                // Danh mục cha gốc
                if (dto.ParentId.HasValue && dto.ParentId.Value > 0)
                {
                    var hasChildren = await _context.Categories.AnyAsync(c => c.ParentId == id && !c.IsDeleted);
                    if (hasChildren)
                    {
                        throw new backend.Exceptions.AppException("Không thể chuyển danh mục cha đang có danh mục con thành danh mục phụ.");
                    }
                    category.ParentId = dto.ParentId.Value;
                }
            }

            var normalizedCode = dto.Code.Trim();
            if (await _context.Categories.AnyAsync(c => !c.IsDeleted && c.Id != id && c.Code == normalizedCode))
            {
                throw new backend.Exceptions.AppException($"Mã danh mục '{normalizedCode}' đã tồn tại.");
            }

            category.Code = normalizedCode;
            category.Name = dto.Name.Trim();
            category.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? normalizedCode.ToLower() : dto.Slug.Trim();
            category.Type = categoryType;
            category.Description = dto.Description;
            category.Icon = dto.Icon;
            category.DisplayOrder = dto.DisplayOrder;
            category.Status = dto.Status ?? "ACTIVE";
            category.LastModificationTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await ClearCategoryCachesAsync(id);
            dto.Type = category.Type;
            return dto;
        }

        private async Task ClearCategoryCachesAsync(int? id = null)
        {
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories));
            await _cacheService.RemoveAsync($"{CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories)}:type:PRODUCT");
            await _cacheService.RemoveAsync($"{CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories)}:type:SERVICE");
            await _cacheService.RemoveAsync($"{CacheKeyGenerator.GetKey(CacheKeyEnum.AllCategories)}:type:PARTNER");
            if (id.HasValue)
            {
                await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.CategoryById, id.Value));
            }
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.Include(c => c.Children).FirstOrDefaultAsync(c => c.Id == id);
            if (category == null || category.IsDeleted) 
                throw new backend.Exceptions.NotFoundException("Danh mục không tồn tại");
            
            // Chặn xóa nếu là danh mục cha gốc
            if (category.ParentId == null)
            {
                throw new backend.Exceptions.AppException("Không thể xóa danh mục cha mặc định của hệ thống.");
            }

            if (category.Children.Any(c => !c.IsDeleted))
                throw new backend.Exceptions.AppException("Không thể xóa danh mục đang chứa các danh mục con");

            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id && !p.IsDeleted);
            if (hasProducts)
                throw new backend.Exceptions.AppException("Không thể xóa danh mục đang có sản phẩm liên kết");

            category.IsDeleted = true;
            category.DeletionTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            await ClearCategoryCachesAsync(id);
            return true;
        }
    }
}
