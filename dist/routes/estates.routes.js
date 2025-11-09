"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estatesRouter = void 0;
const express_1 = require("express");
const estate_service_1 = require("../services/estate.service");
exports.estatesRouter = (0, express_1.Router)();
exports.estatesRouter.get("/", async (_req, res, next) => {
    try {
        const estates = await (0, estate_service_1.listEstates)();
        res.json({ estates });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=estates.routes.js.map