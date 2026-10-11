using backend.Domains.Dtos.File;
using backend.Interfaces;
using backend.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile([FromForm] FileUploadDto request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(backend.Domains.Response.ApiResponse<object>.FailureResult("File is empty or not provided"));
            }

            long? authorId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (long.TryParse(userIdClaim, out var uid))
            {
                authorId = uid;
            }

            var result = await _fileService.UploadFileAsync(request.File, request.ObjectType ?? "general", request.ObjectId ?? "0", authorId);
            // Append FileUrl to result for immediate frontend use if needed
            var url = _fileService.GetFileUrl(result);
            
            return Ok(backend.Domains.Response.ApiResponse<object>.SuccessResult(new
            {
                Data = result,
                Url = url
            }, "File uploaded successfully"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        [RequirePermission("file:delete")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            var success = await _fileService.DeleteFileAsync(id);
            if (!success) throw new backend.Exceptions.AppException("File not found");
            return Ok(backend.Domains.Response.ApiResponse<bool>.SuccessResult(true, "File deleted successfully"));
        }
    
        [HttpGet("view/{*filePath}")]
        public IActionResult GetFile(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return BadRequest("Invalid file path");

            // Sanitize path: remove ../ and ./ to prevent path traversal
            var safePath = filePath.Replace("..", "").Replace("./", "").Replace(".\\", "").TrimStart('/', '\\');
            
            // Strip leading "uploads/" or "uploads\" if passed
            if (safePath.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
            {
                safePath = safePath.Substring(8);
            }
            else if (safePath.StartsWith("uploads\\", StringComparison.OrdinalIgnoreCase))
            {
                safePath = safePath.Substring(8);
            }

            // Get root directory and uploads directory
            var contentRoot = Directory.GetCurrentDirectory();
            var uploadsDir = Path.GetFullPath(Path.Combine(contentRoot, "uploads"));
            
            // Combine with sanitized path and resolve to absolute
            var fullPath = Path.GetFullPath(Path.Combine(uploadsDir, safePath));
            
            // Ensure the resolved path is still inside the uploads directory
            if (!fullPath.StartsWith(uploadsDir, StringComparison.OrdinalIgnoreCase))
                return Forbid("No permission to access this file");

            if (!System.IO.File.Exists(fullPath))
                return NotFound("File not found");

            var ext = Path.GetExtension(fullPath).ToLowerInvariant();
            var contentType = "application/octet-stream";
            
            // Map common image types
            if (ext == ".jpg" || ext == ".jpeg") contentType = "image/jpeg";
            else if (ext == ".png") contentType = "image/png";
            else if (ext == ".gif") contentType = "image/gif";
            else if (ext == ".webp") contentType = "image/webp";
            else if (ext == ".svg") contentType = "image/svg+xml";
            else if (ext == ".pdf") contentType = "application/pdf";

            return PhysicalFile(fullPath, contentType);
        }
}
}
