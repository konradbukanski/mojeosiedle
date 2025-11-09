import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";

interface ErrorResponseBody {
  error: {
    message: string;
    code: number;
    details?: unknown;
  };
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: "Not Found",
      code: 404,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let response: ErrorResponseBody;
  let status = 500;

  if (err instanceof AppError) {
    status = err.statusCode;
    response = {
      error: {
        message: err.message,
        code: err.statusCode,
        details: err.details,
      },
    };
    if (!err.isOperational) {
      logger.error({ err }, "Operational error flagged as non-operational");
    }
  } else if (err instanceof Error) {
    response = {
      error: {
        message: err.message || "Internal Server Error",
        code: status,
      },
    };
    logger.error({ err }, "Unhandled error");
  } else {
    response = {
      error: {
        message: "Internal Server Error",
        code: status,
      },
    };
    logger.error({ err }, "Unknown thrown value");
  }

  res.status(status).json(response);
}

