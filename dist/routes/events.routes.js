"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const event_schema_1 = require("../schemas/event.schema");
const event_service_1 = require("../services/event.service");
exports.eventsRouter = (0, express_1.Router)();
exports.eventsRouter.get("/", (0, auth_1.authenticate)({ optional: true }), (0, validate_request_1.validateRequest)(event_schema_1.listEventsSchema), async (req, res, next) => {
    try {
        const query = req.query;
        const estateId = query.estateId ?? req.user?.estateId;
        if (!estateId || typeof estateId !== "string") {
            return res.status(400).json({ error: { message: "estateId is required" } });
        }
        const events = await (0, event_service_1.listEvents)({
            estateId,
            status: query.status,
            includePending: query.includePending,
            cursor: query.cursor,
            limit: query.limit,
        });
        res.json(events);
    }
    catch (error) {
        next(error);
    }
});
exports.eventsRouter.get("/:id", (0, auth_1.authenticate)({ optional: true }), async (req, res, next) => {
    try {
        const event = await (0, event_service_1.getEventById)(req.params.id);
        if (!event) {
            return res.status(404).json({ error: { message: "Event not found" } });
        }
        if (event.status !== "approved" && req.user?.estateId !== event.estate_id) {
            return res.status(403).json({ error: { message: "Access denied" } });
        }
        res.json(event);
    }
    catch (error) {
        next(error);
    }
});
exports.eventsRouter.post("/", (0, auth_1.authenticate)(), (0, validate_request_1.validateRequest)(event_schema_1.createEventSchema), async (req, res, next) => {
    try {
        const event = await (0, event_service_1.createEvent)({
            estateId: req.user.estateId,
            creatorId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            capacity: req.body.capacity,
            mediaIds: req.body.mediaIds,
        });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
});
exports.eventsRouter.post("/:id/register", (0, auth_1.authenticate)(), (0, validate_request_1.validateRequest)(event_schema_1.registerForEventSchema), async (req, res, next) => {
    try {
        const registration = await (0, event_service_1.registerForEvent)({
            eventId: req.params.id,
            residentId: req.user.id,
            status: req.body.status,
        });
        res.json(registration);
    }
    catch (error) {
        next(error);
    }
});
exports.eventsRouter.patch("/:id/status", (0, auth_1.authenticate)(), (0, auth_1.requireRole)(["moderator", "admin"]), async (req, res, next) => {
    try {
        const status = req.body.status;
        const event = await (0, event_service_1.updateEventStatus)({
            eventId: req.params.id,
            status,
            moderatorId: req.user.id,
        });
        res.json(event);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=events.routes.js.map