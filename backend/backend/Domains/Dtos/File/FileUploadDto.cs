namespace backend.Domains.Dtos.File
{
    public class FileUploadDto
    {
        public IFormFile File { get; set; } = null!;
        public string? ObjectType { get; set; } = "general";
        public string? ObjectId { get; set; } = "0";
    }
}
