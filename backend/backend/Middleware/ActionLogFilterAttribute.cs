using Microsoft.AspNetCore.Mvc.Filters;
using backend.Services;
using backend.Domains.Entities;

namespace backend.Middleware
{
    public class ActionLogFilterAttribute : ActionFilterAttribute
    {
        private readonly string _module;
        private readonly string _action;

        public ActionLogFilterAttribute(string module, string action)
        {
            _module = module;
            _action = action;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Cho phép request chạy trước để lấy kết quả (thành công hay không)
            var resultContext = await next();

            try
            {
                var logService = context.HttpContext.RequestServices.GetService<ILogService>();
                if (logService != null)
                {
                    // Thử lấy UserId từ Token
                    long? userId = null;
                    var nameIdentifier = context.HttpContext.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    if (long.TryParse(nameIdentifier, out var uid))
                    {
                        userId = uid;
                    }

                    var ipAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString();
                    var statusCode = context.HttpContext.Response.StatusCode;

                    var log = new SystemLog
                    {
                        Action = _action,
                        Module = _module,
                        UserId = userId,
                        IPAddress = ipAddress,
                        Details = $"Method: {context.HttpContext.Request.Method}, Path: {context.HttpContext.Request.Path}, StatusCode: {statusCode}"
                    };

                    await logService.LogActionAsync(log);
                }
            }
            catch (Exception)
            {
                // Ignore log save errors to not block the main request
            }
        }
    }
}
