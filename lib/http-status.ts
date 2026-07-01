export interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: "informational" | "success" | "redirection" | "clientError" | "serverError";
}

export const HTTP_STATUS: HttpStatus[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "服务器已收到请求头，客户端应继续发送请求体。", category: "informational" },
  { code: 101, name: "Switching Protocols", description: "服务器已理解并同意切换协议。", category: "informational" },
  { code: 103, name: "Early Hints", description: "提前提示，用于在最终响应前加载资源。", category: "informational" },

  // 2xx Success
  { code: 200, name: "OK", description: "请求成功。", category: "success" },
  { code: 201, name: "Created", description: "请求已成功，并因此创建了新资源。", category: "success" },
  { code: 202, name: "Accepted", description: "请求已接受，但尚未处理完成。", category: "success" },
  { code: 204, name: "No Content", description: "服务器成功处理，但未返回内容。", category: "success" },
  { code: 206, name: "Partial Content", description: "服务器成功处理了部分 GET 请求。", category: "success" },

  // 3xx Redirection
  { code: 301, name: "Moved Permanently", description: "请求的资源已被永久移动到新的 URL。", category: "redirection" },
  { code: 302, name: "Found", description: "请求的资源临时位于不同的 URL。", category: "redirection" },
  { code: 304, name: "Not Modified", description: "资源自上次请求以来未被修改。", category: "redirection" },
  { code: 307, name: "Temporary Redirect", description: "临时重定向，请求应使用相同方法访问新 URL。", category: "redirection" },
  { code: 308, name: "Permanent Redirect", description: "永久重定向，请求应使用相同方法访问新 URL。", category: "redirection" },

  // 4xx Client Error
  { code: 400, name: "Bad Request", description: "服务器无法理解请求，可能是参数错误。", category: "clientError" },
  { code: 401, name: "Unauthorized", description: "请求需要用户身份验证。", category: "clientError" },
  { code: 403, name: "Forbidden", description: "服务器拒绝访问，权限不足。", category: "clientError" },
  { code: 404, name: "Not Found", description: "服务器找不到请求的资源。", category: "clientError" },
  { code: 405, name: "Method Not Allowed", description: "请求方法不被允许。", category: "clientError" },
  { code: 408, name: "Request Timeout", description: "服务器等待客户端发送请求的时间过长。", category: "clientError" },
  { code: 409, name: "Conflict", description: "请求与服务器当前状态冲突。", category: "clientError" },
  { code: 410, name: "Gone", description: "请求的资源已永久删除。", category: "clientError" },
  { code: 422, name: "Unprocessable Entity", description: "请求格式正确，但包含语义错误。", category: "clientError" },
  { code: 429, name: "Too Many Requests", description: "客户端发送请求过多，被限流。", category: "clientError" },

  // 5xx Server Error
  { code: 500, name: "Internal Server Error", description: "服务器内部错误。", category: "serverError" },
  { code: 502, name: "Bad Gateway", description: "网关或代理从上游服务器收到无效响应。", category: "serverError" },
  { code: 503, name: "Service Unavailable", description: "服务器暂时无法处理请求。", category: "serverError" },
  { code: 504, name: "Gateway Timeout", description: "网关或代理等待上游服务器响应超时。", category: "serverError" },
];

export const CATEGORY_LABELS: Record<HttpStatus["category"], { zh: string; en: string }> = {
  informational: { zh: "1xx 信息响应", en: "1xx Informational" },
  success: { zh: "2xx 成功", en: "2xx Success" },
  redirection: { zh: "3xx 重定向", en: "3xx Redirection" },
  clientError: { zh: "4xx 客户端错误", en: "4xx Client Error" },
  serverError: { zh: "5xx 服务器错误", en: "5xx Server Error" },
};
