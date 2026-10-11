using backend.Domains.Entities;
using backend.Domains.Response;
using Microsoft.AspNetCore.Http;

namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<Attachment> UploadFileAsync(IFormFile file, string objectType, string objectId, long? authorId = null);
        Task<bool> DeleteFileAsync(int attachmentId);
        string GetFileUrl(Attachment attachment);
    }
}
