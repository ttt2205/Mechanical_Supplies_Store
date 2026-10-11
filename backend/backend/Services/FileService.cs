using backend.Data;
using backend.Domains.Entities;
using backend.Domains.Response;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FileService : IFileService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public FileService(ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment env)
        {
            _context = context;
            _configuration = configuration;
            _env = env;
        }

        public async Task<Attachment> UploadFileAsync(IFormFile file, string objectType, string objectId, long? authorId = null)
        {
            if (file == null || file.Length == 0)
                throw new backend.Exceptions.AppException("File is empty");

            // Generate physical path (e.g. uploads/2026/09)
            var typeFolder = string.IsNullOrEmpty(objectType) ? "others" : objectType.ToLower().Trim();
            // Sanitize typeFolder to prevent directory traversal just in case
            typeFolder = string.Join("_", typeFolder.Split(Path.GetInvalidFileNameChars()));
            
            var yearMonth = DateTime.UtcNow.ToString("yyyy/MM");
            var diskDir = $"uploads/{typeFolder}/{yearMonth}";
            var uploadDir = Path.Combine(_env.ContentRootPath, diskDir);
            
            if (!Directory.Exists(uploadDir))
                Directory.CreateDirectory(uploadDir);

            var safeFileName = Path.GetFileName(file.FileName);
            var fileExt = Path.GetExtension(safeFileName);
            var diskFileName = $"{Guid.NewGuid()}{fileExt}";
            var filePath = Path.Combine(uploadDir, diskFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new Attachment
            {
                FileName = safeFileName,
                DiskFileName = diskFileName,
                FileSize = (int)file.Length,
                ContentType = file.ContentType,
                DiskDirectory = diskDir,
                AuthorId = authorId
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            // Link to Object
            var mapping = new AttachmentMapping
            {
                AttachmentId = attachment.Id,
                ObjectId = string.IsNullOrEmpty(objectId) ? "0" : objectId,
                ObjectType = string.IsNullOrEmpty(objectType) ? "general" : objectType,
                SyntaxCode = "ORIGINAL"
            };

            _context.AttachmentMappings.Add(mapping);
            await _context.SaveChangesAsync();

            return attachment;
        }

        public async Task<bool> DeleteFileAsync(int attachmentId)
        {
            var attachment = await _context.Attachments.FindAsync(attachmentId);
            if (attachment == null) return false;

            var filePath = Path.Combine(_env.ContentRootPath, attachment.DiskDirectory, attachment.DiskFileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.Attachments.Remove(attachment);
            await _context.SaveChangesAsync();
            return true;
        }

        public string GetFileUrl(Attachment attachment)
        {
            var serverUrl = _configuration.GetValue<string>("App:FileServerUrl", "");
            var relativePath = $"{attachment.DiskDirectory}/{attachment.DiskFileName}";
            
            // Format properly
            serverUrl = serverUrl.TrimEnd('/');
            relativePath = relativePath.TrimStart('/');
            
            return $"{serverUrl}/api/files/view/{relativePath}";
        }
    }
}
