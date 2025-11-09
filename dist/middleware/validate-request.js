"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
const app_error_1 = require("../utils/app-error");
function validateRequest(schema) {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }
            if (parsed.params !== undefined) {
                req.params = parsed.params;
            }
            if (parsed.query !== undefined) {
                Object.assign(req.query, parsed.query);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(new app_error_1.AppError("Validation failed", 422, {
                    details: error.flatten(),
                }));
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate-request.js.map