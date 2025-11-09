"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const app_error_1 = require("../utils/app-error");
const resident_service_1 = require("../services/resident.service");
const rolePriority = {
    resident: 1,
    moderator: 2,
    admin: 3,
};
function authenticate(options = {}) {
    return async (req, _res, next) => {
        const header = req.headers.authorization;
        if (!header) {
            if (options.optional) {
                return next();
            }
            return next(new app_error_1.AppError("Authorization header missing", 401));
        }
        const [scheme, token] = header.split(" ");
        if (scheme !== "Bearer" || !token) {
            return next(new app_error_1.AppError("Invalid authorization header format", 401));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.SUPABASE_JWT_SECRET);
            const authUserId = decoded.sub;
            if (!authUserId) {
                throw new app_error_1.AppError("Token missing subject", 401);
            }
            const resident = await (0, resident_service_1.ensureResident)(authUserId);
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
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                return next(error);
            }
            next(new app_error_1.AppError("Invalid or expired token", 401, { details: error }));
        }
    };
}
function requireRole(roles) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const minRolePriority = requiredRoles.reduce((max, role) => Math.max(max, rolePriority[role]), 0);
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            return next(new app_error_1.AppError("Unauthorized", 401));
        }
        const userPriority = rolePriority[user.role];
        if (userPriority < minRolePriority) {
            return next(new app_error_1.AppError("Forbidden", 403));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map