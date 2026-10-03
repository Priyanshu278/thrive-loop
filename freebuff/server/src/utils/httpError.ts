/** Error type that the centralized error handler converts to a JSON response. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }
  static unauthorized(message = "Please log in"): ApiError {
    return new ApiError(401, message);
  }
  static forbidden(message = "Not allowed"): ApiError {
    return new ApiError(403, message);
  }
  static notFound(message = "Not found"): ApiError {
    return new ApiError(404, message);
  }
  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }
  static serviceUnavailable(message: string): ApiError {
    return new ApiError(503, message);
  }
}
