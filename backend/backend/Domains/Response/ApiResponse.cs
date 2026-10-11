using System.Text.Json.Serialization;

namespace backend.Domains.Response
{
    public class ApiResponse<T>
    {
        public int Status { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public T? Data { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public PaginationMeta? Meta { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Errors { get; set; }

        // Helper: Phản hồi thành công
        public static ApiResponse<T> SuccessResult(T data, string message = "Success", int status = 200)
        {
            return new ApiResponse<T>
            {
                Status = status,
                Success = true,
                Message = message,
                Data = data,
                Errors = null
            };
        }

        public static ApiResponse<T> PagedResult(T data, PaginationMeta meta, string message = "Data fetched successfully", int status = 200)
        {
            return new ApiResponse<T>
            {
                Status = status,
                Success = true,
                Message = message,
                Data = data,
                Meta = meta,
                Errors = null
            };
        }

        // Helper: Phản hồi thất bại
        public static ApiResponse<T> FailureResult(string message, object? errors = null, int status = 400)
        {
            return new ApiResponse<T>
            {
                Status = status,
                Success = false,
                Message = message,
                Data = default,
                Errors = errors
            };
        }
    }
}
