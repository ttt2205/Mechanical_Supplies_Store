using backend.Domains.Dtos.Product;

namespace backend.Interfaces
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 10, string? search = null);
        Task<ProductDto> GetProductBySlugAsync(string slug);
        Task<ProductDto> CreateProductAsync(ProductDto dto);
        Task<ProductDto> UpdateProductAsync(long id, ProductDto dto);
        Task<bool> DeleteProductAsync(long id);
        Task<bool> IncrementViewCountAsync(string slug);
    }
}
