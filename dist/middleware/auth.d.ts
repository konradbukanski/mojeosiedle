import type { NextFunction, Request, Response } from "express";
import type { ResidentRole } from "../schemas/resident.schema";
export declare function authenticate(options?: {
    optional?: boolean;
}): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare function requireRole(roles: ResidentRole | ResidentRole[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map