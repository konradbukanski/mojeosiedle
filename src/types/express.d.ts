import type { ResidentRole } from "../schemas/resident.schema";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      authUserId: string;
      role: ResidentRole;
      estateId: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  }
}

