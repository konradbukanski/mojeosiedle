import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { createEventSchema, listEventsSchema, registerForEventSchema } from "../schemas/event.schema";
import {
  createEvent,
  getEventById,
  listEvents,
  registerForEvent,
  updateEventStatus,
} from "../services/event.service";
import type { z } from "zod";

export const eventsRouter = Router();

eventsRouter.get("/", authenticate({ optional: true }), validateRequest(listEventsSchema), async (req, res, next) => {
  try {
    const query = req.query as unknown as z.infer<typeof listEventsSchema>["query"];
    const estateId = query.estateId ?? req.user?.estateId;
    if (!estateId || typeof estateId !== "string") {
      return res.status(400).json({ error: { message: "estateId is required" } });
    }

    const events = await listEvents({
      estateId,
      status: query.status,
      includePending: query.includePending,
      cursor: query.cursor,
      limit: query.limit,
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

eventsRouter.get("/:id", authenticate({ optional: true }), async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }

    if (event.status !== "approved" && req.user?.estateId !== event.estate_id) {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

eventsRouter.post("/", authenticate(), validateRequest(createEventSchema), async (req, res, next) => {
  try {
    const event = await createEvent({
      estateId: req.user!.estateId,
      creatorId: req.user!.id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      capacity: req.body.capacity,
      mediaIds: req.body.mediaIds,
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

eventsRouter.post(
  "/:id/register",
  authenticate(),
  validateRequest(registerForEventSchema),
  async (req, res, next) => {
    try {
      const registration = await registerForEvent({
        eventId: req.params.id,
        residentId: req.user!.id,
        status: req.body.status,
      });

      res.json(registration);
    } catch (error) {
      next(error);
    }
  }
);

eventsRouter.patch(
  "/:id/status",
  authenticate(),
  requireRole(["moderator", "admin"]),
  async (req, res, next) => {
    try {
      const status = req.body.status;
      const event = await updateEventStatus({
        eventId: req.params.id,
        status,
        moderatorId: req.user!.id,
      });

      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);
