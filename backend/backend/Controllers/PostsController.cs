using Microsoft.AspNetCore.Authorization;
using backend.Domains.Dtos.Post;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? type = null)
        {
            var result = await _postService.GetAllPostsAsync(page, limit, type);
            return Ok(ApiResponse<List<PostDto>>.PagedResult(result.Data, result.Meta, "Success"));
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetPostBySlug(string slug)
        {
            var result = await _postService.GetPostBySlugAsync(slug);
            return Ok(ApiResponse<PostDto>.SuccessResult(result, "Success"));
        }

        [HttpPost]
        [Authorize]
        [backend.Middleware.RequirePermission("post:create")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            var result = await _postService.CreatePostAsync(dto);
            return Ok(ApiResponse<PostDto>.SuccessResult(result, "Success"));
        }

        [HttpPut("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("post:update")]
        public async Task<IActionResult> UpdatePost(long id, [FromBody] CreatePostDto dto)
        {
            var result = await _postService.UpdatePostAsync(id, dto);
            return Ok(ApiResponse<PostDto>.SuccessResult(result, "Success"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        [backend.Middleware.RequirePermission("post:delete")]
        public async Task<IActionResult> DeletePost(long id)
        {
            var result = await _postService.DeletePostAsync(id);
            return Ok(ApiResponse<bool>.SuccessResult(result, "Success"));
        }
    }
}
