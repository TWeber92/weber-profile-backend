export class WeberProfileError extends Error {
  constructor(message, name, context, status) {
    super(message);
    this.name = `WeberProfileError: ${name}`;
    this.context = context;
    this.status = status;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      context: this.context,
      status: this.status,
      timestamp: this.timestamp,
    };
  }
}

export class NotFoundError extends WeberProfileError {
  constructor(resource, id) {
    super(
      `${resource} with ID ${id} not found`,
      "ResourceNotFound",
      {
        resource,
        id,
      },
      404,
    );
  }
}
export class ValidationError extends WeberProfileError {
  constructor(field, message) {
    super(
      `Validation failed for ${field}: ${message}`,
      "ValidationError",
      { field },
      400,
    );
  }
}
export class AuthenticationError extends WeberProfileError {
  constructor(message, context) {
    super(message, "AuthenticationError", context, 401);
  }
}
export class AuthorizationError extends WeberProfileError {
  constructor(resource, context) {
    super(
      `User: ${resource} is not authorized to perform this action`,
      "AuthorizationError",
      context,
      403,
    );
  }
}
export class RateLimitError extends WeberProfileError {
  constructor(message){
    super(
      message,
      "RateLimit",
      {},
      429
    )
  }
}
export class OortError extends WeberProfileError {
  constructor(message, originalError, code, status) {
    super(
      `OORT operation failed: ${message}`,
      code,
      { originalError: originalError.Resource },
      status,
    );
    this.code = code
  }
}
export class EmailError extends WeberProfileError {
  constructor(error) {
    super(
      "PIN created but email failed. Please try again.",
      "WorkerMailerError",
      "weber-profile-proxy/postTempPin",
      error.statusCode || 500,
    );
  }
}
export class ParameterError extends WeberProfileError {
  constructor(message) {
    super(
      `Parameter Missing: ${message}`,
      "ParameterError",
      "weber-profile-proxy/functions/getCoin",
      400,
    );
  }
}