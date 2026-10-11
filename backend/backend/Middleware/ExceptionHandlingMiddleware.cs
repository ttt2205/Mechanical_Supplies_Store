using backend.Domains.Response;
using backend.Exceptions;
using System.Net;
using System.Text.Json;

namespace backend.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = context.Response;
            var errorResponse = new ApiResponse<object>();

            switch (exception)
            {
                case AppException e:
                    // custom application error
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse = ApiResponse<object>.FailureResult(e.Message, null, response.StatusCode);
                    break;
                case NotFoundException e:
                    // not found error
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse = ApiResponse<object>.FailureResult(e.Message, null, response.StatusCode);
                    break;
                case KeyNotFoundException e:
                    // not found error
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse = ApiResponse<object>.FailureResult(e.Message, null, response.StatusCode);
                    break;
                default:
                    // unhandled error
                    _logger.LogError(exception, exception.Message);
                    
                    // Ghi log lỗi vào Database (bảng SystemErrors)
                    try
                    {
                        var logService = context.RequestServices.GetService<backend.Services.ILogService>();
                        if (logService != null)
                        {
                            await logService.LogErrorAsync(new backend.Domains.Entities.SystemError
                            {
                                ErrorMessage = exception.Message,
                                StackTrace = exception.StackTrace,
                                Path = context.Request.Path,
                                Source = exception.Source,
                                Level = "ERROR"
                            });
                        }
                    }
                    catch (Exception logEx)
                    {
                        _logger.LogError(logEx, "Failed to write error log to Database");
                    }

                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse = ApiResponse<object>.FailureResult("Internal system error. Please try again later.", null, response.StatusCode);
                    break;
            }

            var result = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await context.Response.WriteAsync(result);
        }
    }
}
