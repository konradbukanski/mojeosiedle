import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { sendNotificationSchema } from "../schemas/notification.schema";
import { dispatchNotification } from "../services/notification.service";

export const notificationsRouter = Router();

notificationsRouter.post(
  "/send",
  authenticate(),
  requireRole(["moderator", "admin"]),
  validateRequest(sendNotificationSchema),
  async (req, res, next) => {
    try {
      const result = await dispatchNotification(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

