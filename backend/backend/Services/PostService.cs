using backend.Data;
using backend.Domains.Dtos.Post;
using backend.Domains.Response;
using backend.Domains.Entities;
using backend.Exceptions;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Constants.Cache;
using backend.Enums;

namespace backend.Services
{
    public class PostService : IPostService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public PostService(ApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<(List<PostDto> Data, PaginationMeta Meta)> GetAllPostsAsync(int page = 1, int pageSize = 10, string? type = null)
        {
            var query = _context.Posts.Include(p => p.Sections).AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(p => p.PostType == type);
            }

            var totalItems = await query.CountAsync();

            var posts = await query
                .OrderByDescending(p => p.CreationTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId,
                    PostType = p.PostType,
                    Title = p.Title,
                    Slug = p.Slug,
                    Excerpt = p.Excerpt,
                    Thumbnail = p.Thumbnail,
                    Status = p.Status,
                    CreationTime = p.CreationTime,
                    Sections = p.Sections.OrderBy(s => s.Order).Select(s => new PostSectionDto {
                        Id = s.Id,
                        Heading = s.Heading,
                        Content = s.Content,
                        Order = s.Order
                    }).ToList()
                })
                .ToListAsync();

            var meta = new PaginationMeta(page, pageSize, totalItems); return (posts, meta);
        }

        public async Task<PostDto> GetPostBySlugAsync(string slug)
        {
            string cacheKey = CacheKeyGenerator.GetKey(CacheKeyEnum.PostBySlug, slug);
            var post = await _cacheService.GetAsync<PostDto>(cacheKey);

            if (post == null)
            {
                post = await _context.Posts
                    .Include(p => p.Sections.Where(s => !s.IsDeleted).OrderBy(s => s.Order))
                    .Where(p => p.Slug == slug)
                    .Select(p => new PostDto
                    {
                        Id = p.Id,
                        CategoryId = p.CategoryId,
                        PostType = p.PostType,
                        Slug = p.Slug,
                        Title = p.Title,
                        Excerpt = p.Excerpt,
                        Thumbnail = p.Thumbnail,
                        Status = p.Status,
                        CreationTime = p.CreationTime,
                        Sections = p.Sections.Where(s => !s.IsDeleted).Select(s => new PostSectionDto
                        {
                            Heading = s.Heading,
                            Content = s.Content,
                            Order = s.Order
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (post != null)
                {
                    await _cacheService.SetAsync(cacheKey, post, TimeSpan.FromMinutes(30));
                }
            }

            if (post == null)
            {
                throw new AppException("Post not found");
            }

            return post;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto dto)
        {
            if (string.IsNullOrEmpty(dto.Slug))
            {
                dto.Slug = dto.Title.ToLower().Replace(" ", "-");
            }

            var post = new Post
            {
                CategoryId = dto.CategoryId,
                PostType = dto.PostType,
                Title = dto.Title,
                Slug = dto.Slug,
                Excerpt = dto.Excerpt,
                Thumbnail = dto.Thumbnail,
                Status = dto.Status,
                Sections = dto.Sections.Select((s, index) => new PostSection
                {
                    Heading = s.Heading,
                    Content = s.Content,
                    Order = s.Order > 0 ? s.Order : index
                }).ToList()
            };
            
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllPostsKey());
            var result = await GetPostBySlugAsync(post.Slug);
            return result;
        }

        public async Task<PostDto> UpdatePostAsync(long id, CreatePostDto dto)
        {
            var post = await _context.Posts.Include(p => p.Sections).FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) throw new AppException("Post not found");

            post.CategoryId = dto.CategoryId;
            post.PostType = dto.PostType;
            post.Title = dto.Title;
            if (!string.IsNullOrEmpty(dto.Slug)) post.Slug = dto.Slug;
            post.Excerpt = dto.Excerpt;
            post.Thumbnail = dto.Thumbnail;
            post.Status = dto.Status;
            post.LastModificationTime = DateTime.UtcNow;

            // Xóa sections cũ và thêm mới (cách đơn giản nhất để cập nhật)
            _context.PostSections.RemoveRange(post.Sections);
            
            post.Sections = dto.Sections.Select((s, index) => new PostSection
            {
                Heading = s.Heading,
                Content = s.Content,
                Order = s.Order > 0 ? s.Order : index
            }).ToList();

            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllPostsKey());
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.PostBySlug, post.Slug));
            var result = await GetPostBySlugAsync(post.Slug);
            return result;
        }

        public async Task<bool> DeletePostAsync(long id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) throw new AppException("Post not found");
            
            post.IsDeleted = true;
            post.DeletionTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeyGenerator.GetAllPostsKey());
            if (!string.IsNullOrEmpty(post.Slug)) await _cacheService.RemoveAsync(CacheKeyGenerator.GetKey(CacheKeyEnum.PostBySlug, post.Slug));
            return true;
        }
    }
}

