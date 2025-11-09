import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import {
  createAnnouncementSchema,
  listAnnouncementsSchema,
  updateAnnouncementStatusSchema,
} from "../schemas/announcement.schema";
import {
  createAnnouncement,
  listAnnouncements,
  updateAnnouncementStatus,
  getAnnouncementById,
} from "../services/announcement.service";
import type { z } from "zod";

export const announcementsRouter = Router();

announcementsRouter.get("/", authenticate({ optional: true }), validateRequest(listAnnouncementsSchema), async (req, res, next) => {
  try {
    const query = req.query as unknown as z.infer<typeof listAnnouncementsSchema>["query"];
    const estateId = query.estateId ?? req.user?.estateId;
    if (!estateId || typeof estateId !== "string") {
      return res.status(400).json({ error: { message: "estateId is required" } });
    }

    const result = await listAnnouncements({
      estateId,
      scope: query.scope,
      category: query.category,
      building: query.building,
      includePending: query.includePending,
      limit: query.limit,
      cursor: query.cursor,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

announcementsRouter.get("/:id", authenticate({ optional: true }), async (req, res, next) => {
  try {
    const announcement = await getAnnouncementById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: { message: "Announcement not found" } });
    }

    if (announcement.status !== "approved" && req.user?.estateId !== announcement.estate_id) {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    res.json(announcement);
  } catch (error) {
    next(error);
  }
});

announcementsRouter.post(
  "/",
  authenticate(),
  validateRequest(createAnnouncementSchema),
  async (req, res, next) => {
    try {
      const announcement = await createAnnouncement({
        estateId: req.user!.estateId,
        authorId: req.user!.id,
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
    } catch (error) {
      next(error);
    }
  }
);

announcementsRouter.patch(
  "/:id/status",
  authenticate(),
  requireRole(["moderator", "admin"]),
  validateRequest(updateAnnouncementStatusSchema),
  async (req, res, next) => {
    try {
      const announcement = await updateAnnouncementStatus({
        announcementId: req.params.id,
        status: req.body.status,
        reason: req.body.reason,
        moderatorId: req.user!.id,
      });

      res.json(announcement);
    } catch (error) {
      next(error);
    }
  }
);
