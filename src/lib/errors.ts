export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export function getSafeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again later.";
}
