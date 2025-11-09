import type { NextFunction, Request, Response } from "express";
import { type ZodTypeAny } from "zod";
export declare function validateRequest(schema: ZodTypeAny): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate-request.d.ts.map