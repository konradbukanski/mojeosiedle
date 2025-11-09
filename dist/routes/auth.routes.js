"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const validate_request_1 = require("../middleware/validate-request");
const auth_schema_1 = require("../schemas/auth.schema");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", (0, validate_request_1.validateRequest)(auth_schema_1.registerRequestSchema), async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.registerResident)(req.body);
        res.status(201).json({
            userId: result.user.id,
            email: result.user.email,
            residentId: result.residentId,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post("/login", (0, validate_request_1.validateRequest)(auth_schema_1.loginRequestSchema), async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.loginResident)(req.body);
        res.json({
            user: {
                id: result.user.id,
                email: result.user.email,
            },
            resident: {
                id: result.resident.id,
                firstName: result.resident.first_name,
                lastName: result.resident.last_name,
                estateId: result.resident.estate_id,
                building: result.resident.building,
                staircase: result.resident.staircase,
                floor: result.resident.floor,
                apartment: result.resident.apartment,
                role: result.resident.role,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.routes.js.map