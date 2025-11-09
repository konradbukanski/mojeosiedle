"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const app_error_1 = require("../utils/app-error");
const logger_1 = require("../utils/logger");
function notFoundHandler(_req, res) {
    res.status(404).json({
        error: {
            message: "Not Found",
            code: 404,
        },
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, _req, res, _next) {
    let response;
    let status = 500;
    if (err instanceof app_error_1.AppError) {
        status = err.statusCode;
        response = {
            error: {
                message: err.message,
                code: err.statusCode,
                details: err.details,
            },
        };
        if (!err.isOperational) {
            logger_1.logger.error({ err }, "Operational error flagged as non-operational");
        }
    }
    else if (err instanceof Error) {
        response = {
            error: {
                message: err.message || "Internal Server Error",
                code: status,
            },
        };
        logger_1.logger.error({ err }, "Unhandled error");
    }
    else {
        response = {
            error: {
                message: "Internal Server Error",
                code: status,
            },
        };
        logger_1.logger.error({ err }, "Unknown thrown value");
    }
    res.status(status).json(response);
}
//# sourceMappingURL=error-handler.js.map