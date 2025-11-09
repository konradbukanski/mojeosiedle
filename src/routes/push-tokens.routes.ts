import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { registerPushTokenSchema } from "../schemas/push-token.schema";
import { registerPushToken } from "../services/push-token.service";

export const pushTokensRouter = Router();

pushTokensRouter.post(
  "/",
  authenticate(),
  validateRequest(registerPushTokenSchema),
  async (req, res, next) => {
    try {
      const record = await registerPushToken({
        residentId: req.user!.id,
        estateId: req.user!.estateId,
        token: req.body.token,
        platform: req.body.platform,
        device: req.body.device,
      });

      res.status(201).json({
        id: record.id,
        platform: record.platform,
        device: record.device,
        lastUsedAt: record.last_used_at,
      });
    } catch (error) {
      next(error);
    }
  }
);

