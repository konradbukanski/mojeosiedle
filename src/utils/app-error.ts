export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, options?: { isOperational?: boolean; details?: unknown }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? statusCode < 500;
    this.details = options?.details;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function assertCondition(condition: boolean, message: string, statusCode = 400): asserts condition {
  if (!condition) {
    throw new AppError(message, statusCode);
  }
}

