import type { Application } from "express";
import { Router } from "express";
import { authRouter } from "./auth.routes";
import { profileRouter } from "./profile.routes";
import { announcementsRouter } from "./announcements.routes";
import { eventsRouter } from "./events.routes";
import { marketplaceRouter } from "./marketplace.routes";
import { shopsRouter } from "./shops.routes";
import { issuesRouter } from "./issues.routes";
import { mediaRouter } from "./media.routes";
import { pushTokensRouter } from "./push-tokens.routes";
import { notificationsRouter } from "./notifications.routes";
import { estatesRouter } from "./estates.routes";

export function registerRoutes(app: Application) {
  const api = Router();

  api.use("/auth", authRouter);
  api.use("/profile", profileRouter);
  api.use("/announcements", announcementsRouter);
  api.use("/events", eventsRouter);
  api.use("/marketplace", marketplaceRouter);
  api.use("/shops", shopsRouter);
  api.use("/issues", issuesRouter);
  api.use("/media", mediaRouter);
  api.use("/push-tokens", pushTokensRouter);
  api.use("/notifications", notificationsRouter);
  api.use("/estates", estatesRouter);

  app.use("/api", api);
}
