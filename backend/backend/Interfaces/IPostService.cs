using backend.Domains.Dtos.Post;
using backend.Domains.Response;

namespace backend.Interfaces
{
    public interface IPostService
    {
        Task<(List<PostDto> Data, PaginationMeta Meta)> GetAllPostsAsync(int page = 1, int pageSize = 10, string? type = null);
        Task<PostDto> GetPostBySlugAsync(string slug);
        Task<PostDto> CreatePostAsync(CreatePostDto dto);
        Task<PostDto> UpdatePostAsync(long id, CreatePostDto dto);
        Task<bool> DeletePostAsync(long id);
    }
}
