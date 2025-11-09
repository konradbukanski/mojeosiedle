import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { AppError } from "../utils/app-error";

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as { body?: unknown; params?: unknown; query?: unknown };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as Record<string, string>;
      }
      if (parsed.query !== undefined) {
        Object.assign(req.query as Record<string, unknown>, parsed.query as Record<string, unknown>);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError("Validation failed", 422, {
            details: error.flatten(),
          })
        );
      }

      next(error);
    }
  };
}
