import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { ensureResident } from "../services/resident.service";
import type { ResidentRole } from "../schemas/resident.schema";

interface JwtPayload extends jwt.JwtPayload {
  sub: string;
  email?: string;
  role?: ResidentRole;
  app_metadata?: {
    role?: ResidentRole;
  };
  user_metadata?: Record<string, unknown>;
}

const rolePriority: Record<ResidentRole, number> = {
  resident: 1,
  moderator: 2,
  admin: 3,
};

export function authenticate(options: { optional?: boolean } = {}) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
      if (options.optional) {
        return next();
      }
      return next(new AppError("Authorization header missing", 401));
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Invalid authorization header format", 401));
    }

    try {
      const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET) as JwtPayload;
      const authUserId = decoded.sub;
      if (!authUserId) {
        throw new AppError("Token missing subject", 401);
      }

      const resident = await ensureResident(authUserId);

      req.user = {
        id: resident.id,
        authUserId: resident.auth_user_id,
        role: resident.role,
        estateId: resident.estate_id,
        email: decoded.email,
        firstName: resident.first_name,
        lastName: resident.last_name,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }

      next(new AppError("Invalid or expired token", 401, { details: error }));
    }
  };
}

export function requireRole(roles: ResidentRole | ResidentRole[]) {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const minRolePriority = requiredRoles.reduce((max, role) => Math.max(max, rolePriority[role]), 0);

  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    const userPriority = rolePriority[user.role];
    if (userPriority < minRolePriority) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}

