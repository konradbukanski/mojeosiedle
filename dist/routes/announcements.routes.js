"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const announcement_schema_1 = require("../schemas/announcement.schema");
const announcement_service_1 = require("../services/announcement.service");
exports.announcementsRouter = (0, express_1.Router)();
exports.announcementsRouter.get("/", (0, auth_1.authenticate)({ optional: true }), (0, validate_request_1.validateRequest)(announcement_schema_1.listAnnouncementsSchema), async (req, res, next) => {
    try {
        const query = req.query;
        const estateId = query.estateId ?? req.user?.estateId;
        if (!estateId || typeof estateId !== "string") {
            return res.status(400).json({ error: { message: "estateId is required" } });
        }
        const result = await (0, announcement_service_1.listAnnouncements)({
            estateId,
            scope: query.scope,
            category: query.category,
            building: query.building,
            includePending: query.includePending,
            limit: query.limit,
            cursor: query.cursor,
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.announcementsRouter.get("/:id", (0, auth_1.authenticate)({ optional: true }), async (req, res, next) => {
    try {
        const announcement = await (0, announcement_service_1.getAnnouncementById)(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: { message: "Announcement not found" } });
        }
        if (announcement.status !== "approved" && req.user?.estateId !== announcement.estate_id) {
            return res.status(403).json({ error: { message: "Access denied" } });
        }
        res.json(announcement);
    }
    catch (error) {
        next(error);
    }
});
exports.announcementsRouter.post("/", (0, auth_1.authenticate)(), (0, validate_request_1.validateRequest)(announcement_schema_1.createAnnouncementSchema), async (req, res, next) => {
    try {
        const announcement = await (0, announcement_service_1.createAnnouncement)({
            estateId: req.user.estateId,
            authorId: req.user.id,
            title: req.body.title,
            body: req.body.body,
            category: req.body.category,
            scope: req.body.scope,
            building: req.body.building,
            staircase: req.body.staircase,
            publishAt: req.body.publishAt,
            expiresAt: req.body.expiresAt,
            mediaIds: req.body.mediaIds,
        });
        res.status(201).json(announcement);
    }
    catch (error) {
        next(error);
    }
});
exports.announcementsRouter.patch("/:id/status", (0, auth_1.authenticate)(), (0, auth_1.requireRole)(["moderator", "admin"]), (0, validate_request_1.validateRequest)(announcement_schema_1.updateAnnouncementStatusSchema), async (req, res, next) => {
    try {
        const announcement = await (0, announcement_service_1.updateAnnouncementStatus)({
            announcementId: req.params.id,
            status: req.body.status,
            reason: req.body.reason,
            moderatorId: req.user.id,
        });
        res.json(announcement);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=announcements.routes.js.map