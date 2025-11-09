"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = unwrap;
exports.unwrapMaybe = unwrapMaybe;
const app_error_1 = require("../utils/app-error");
const logger_1 = require("../utils/logger");
function unwrap(response) {
    if (response.error) {
        logger_1.logger.error({ err: response.error }, "Supabase query failed");
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (response.data === null) {
        throw new app_error_1.AppError("Supabase query returned no data", 404);
    }
    return response.data;
}
function unwrapMaybe(response) {
    if (response.error) {
        logger_1.logger.error({ err: response.error }, "Supabase query failed");
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    return response.data;
}
//# sourceMappingURL=supabase.service.js.map