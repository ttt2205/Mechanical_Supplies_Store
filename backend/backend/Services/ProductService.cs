using backend.Data;
using backend.Domains.Dtos.Product;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Constants.Cache;
using backend.Enums;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public ProductService(ApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<List<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 10, string? search = null)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.ProductCode.Contains(search));
            }

            var products = await query
                .OrderByDescending(p => p.CreationTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId,
                    ProductCode = p.ProductCode,
                    Name = p.Name,
                    Slug = p.Slug,
                    IsFeatured = p.IsFeatured,
                    IsContactPrice = p.IsContactPrice,
                    BasePrice = p.BasePrice,
                    SalePrice = p.SalePrice,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    SoldCount = p.SoldCount,
                    Brand = p.Brand,
                    Origin = p.Origin,
                    ShortDescription = p.ShortDescription,
                    Content = p.Content,
                    StockQuantity = p.StockQuantity,
                    Thumbnail = p.Thumbnail
                })
                .ToListAsync();

            return products;
        }

        public async Task<ProductDto> GetProductBySlugAsync(string slug)
        {
            string cacheKey = CacheKeyGenerator.GetKey(CacheKeyEnum.ProductBySlug, slug);
            var product = await _cacheService.GetAsync<ProductDto>(cacheKey);

            if (product == null)
            {
                product = await _context.Products
                    .Where(p => p.Slug == slug || p.ProductCode == slug)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        CategoryId = p.CategoryId,
                        ProductCode = p.ProductCode,
                        Name = p.Name,
                        Slug = p.Slug,
                        IsFeatured = p.IsFeatured,
                        IsContactPrice = p.IsContactPrice,
                        BasePrice = p.BasePrice,
                        SalePrice = p.SalePrice,
                        Status = p.Status,
                        ViewCount = p.ViewCount,
                        SoldCount = p.SoldCount,
                        Brand = p.Brand,
                        Origin = p.Origin,
                        ShortDescription = p.ShortDescription,
                        Content = p.Content,
                        StockQuantity = p.StockQuantity,
                        Thumbnail = p.Thumbnail
                    })
                    .FirstOrDefaultAsync();

                if (product != null)
                {
                    await _cacheService.SetAsync(cacheKey, product, TimeSpan.FromMinutes(30));
                }
            }
            if (product == null)
            {
                throw new AppException("Product not found");
            }

            return product;
        }

        public async Task<ProductDto> CreateProductAsync(ProductDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ProductCode))
            {
                var category = await _context.Categories.FindAsync(dto.CategoryId);
                if (category != null && !string.IsNullOrWhiteSpace(category.Code))
                {
                    var count = await _context.Products.CountAsync(p => p.CategoryId == dto.CategoryId);
                    dto.ProductCode = $"{category.Code}-{(count + 1):D3}";
                }
                else
                {
                    dto.ProductCode = $"PROD-{DateTime.UtcNow.ToString("yyyyMMddHHmmss")}";
                }
            }

            var product = new backend.Domains.Entities.Product
            {
                CategoryId = dto.CategoryId,
                ProductCode = dto.ProductCode,
                Name = dto.Name,
                Slug = dto.Slug,
                IsFeatured = dto.IsFeatured,
                IsContactPrice = dto.IsContactPrice,
                BasePrice = dto.BasePrice,
                SalePrice = dto.SalePrice,
                Status = dto.Status,
                Brand = dto.Brand,
                Origin = dto.Origin,
                ShortDescription = dto.ShortDescription,
                Content = dto.Content,
                StockQuantity = dto.StockQuantity,
                Thumbnail = dto.Thumbnail
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            dto.Id = product.Id;
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllProductsKey());
            return dto;
        }

        public async Task<ProductDto> UpdateProductAsync(long id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new AppException("Product not found");

            product.CategoryId = dto.CategoryId;
            product.ProductCode = dto.ProductCode;
            product.Name = dto.Name;
            product.Slug = dto.Slug;
            product.IsFeatured = dto.IsFeatured;
            product.IsContactPrice = dto.IsContactPrice;
            product.BasePrice = dto.BasePrice;
            product.SalePrice = dto.SalePrice;
            product.Status = dto.Status;
            product.Brand = dto.Brand;
            product.Origin = dto.Origin;
            product.ShortDescription = dto.ShortDescription;
            product.Content = dto.Content;
            product.StockQuantity = dto.StockQuantity;
            if (!string.IsNullOrEmpty(dto.Thumbnail))
            {
                product.Thumbnail = dto.Thumbnail;
            }
            product.LastModificationTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllProductsKey());
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.ProductBySlug, dto.Slug));
            return dto;
        }

        public async Task<bool> DeleteProductAsync(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new AppException("Product not found");
            
            product.IsDeleted = true;
            product.DeletionTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllProductsKey());
            if (!string.IsNullOrEmpty(product.Slug)) await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.ProductBySlug, product.Slug));
            return true;
        }

        public async Task<bool> IncrementViewCountAsync(string slug)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Slug == slug);
            if (product != null)
            {
                product.ViewCount += 1;
                await _context.SaveChangesAsync();
            }
            return true;
        }
    }
}
