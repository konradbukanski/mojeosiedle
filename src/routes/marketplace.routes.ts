import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import {
  createMarketplaceItemSchema,
  listMarketplaceItemsSchema,
  updateMarketplaceStatusSchema,
  updateMarketplaceItemSchema,
} from "../schemas/marketplace.schema";
import {
  createMarketplaceItem,
  getMarketplaceItemById,
  listMarketplaceItems,
  updateMarketplaceStatus,
  updateMarketplaceItem,
  deleteMarketplaceItem,
} from "../services/marketplace.service";
import type { z } from "zod";

export const marketplaceRouter = Router();

marketplaceRouter.get(
  "/",
  authenticate({ optional: true }),
  validateRequest(listMarketplaceItemsSchema),
  async (req, res, next) => {
    try {
      const query = req.query as unknown as z.infer<typeof listMarketplaceItemsSchema>["query"];
      const estateId = query.estateId ?? req.user?.estateId;
      if (!estateId || typeof estateId !== "string") {
        return res.status(400).json({ error: { message: "estateId is required" } });
      }

      const result = await listMarketplaceItems({
        estateId,
        status: query.status,
        category: query.category,
        listingType: query.listingType,
        includePending: query.includePending,
        cursor: query.cursor,
        limit: query.limit,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

marketplaceRouter.post(
  "/",
  authenticate(),
  validateRequest(createMarketplaceItemSchema),
  async (req, res, next) => {
    try {
      const item = await createMarketplaceItem({
        estateId: req.user!.estateId,
        sellerId: req.user!.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price ?? null,
        currency: req.body.currency ?? "PLN",
        category: req.body.category,
        listingType: req.body.listingType ?? "offer",
        mediaIds: req.body.mediaIds,
      });

      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

marketplaceRouter.get("/mine", authenticate(), async (req, res, next) => {
  try {
    const limit =
      typeof req.query.limit === "string" ? Math.min(Math.max(Number(req.query.limit), 1), 100) : 20;
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = await listMarketplaceItems({
      estateId: req.user!.estateId,
      sellerId: req.user!.id,
      includePending: true,
      limit,
      cursor,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

marketplaceRouter.get("/:id", authenticate({ optional: true }), async (req, res, next) => {
  try {
    const item = await getMarketplaceItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: { message: "Item not found" } });
    }

    if (item.status !== "approved" && req.user?.estateId !== item.estate_id) {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

marketplaceRouter.patch(
  "/:id/status",
  authenticate(),
  requireRole(["moderator", "admin"]),
  validateRequest(updateMarketplaceStatusSchema),
  async (req, res, next) => {
    try {
      const item = await updateMarketplaceStatus({
        id: req.params.id,
        status: req.body.status,
      });

      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

marketplaceRouter.patch(
  "/:id",
  authenticate(),
  validateRequest(updateMarketplaceItemSchema),
  async (req, res, next) => {
    try {
      const item = await updateMarketplaceItem({
        id: req.params.id,
        sellerId: req.user!.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency,
        category: req.body.category,
        listingType: req.body.listingType,
        status: req.body.status,
        mediaIds: req.body.mediaIds,
      });

      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

marketplaceRouter.delete("/:id", authenticate(), async (req, res, next) => {
  try {
    const item = await deleteMarketplaceItem(req.params.id, req.user!.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
});
