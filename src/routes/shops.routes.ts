import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { createShopSchema, updateShopStatusSchema } from "../schemas/shop.schema";
import { createShop, getShopById, listShops, updateShopStatus } from "../services/shop.service";

export const shopsRouter = Router();

shopsRouter.get("/", authenticate({ optional: true }), async (req, res, next) => {
  try {
    const estateId = (req.query.estateId as string | undefined) ?? req.user?.estateId;
    if (!estateId) {
      return res.status(400).json({ error: { message: "estateId is required" } });
    }

    const shops = await listShops({ estateId, status: req.user ? undefined : "approved" });
    res.json(shops);
  } catch (error) {
    next(error);
  }
});

shopsRouter.get("/:id", authenticate({ optional: true }), async (req, res, next) => {
  try {
    const shop = await getShopById(req.params.id);
    if (!shop) {
      return res.status(404).json({ error: { message: "Shop not found" } });
    }

    if (shop.status !== "approved" && req.user?.estateId !== shop.estate_id) {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    res.json(shop);
  } catch (error) {
    next(error);
  }
});

shopsRouter.post(
  "/",
  authenticate(),
  requireRole(["admin"]),
  validateRequest(createShopSchema),
  async (req, res, next) => {
    try {
      const shop = await createShop({
        estateId: req.user!.estateId,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        phone: req.body.phone,
        website: req.body.website,
        address: req.body.address,
        openingHours: req.body.openingHours,
      });

      res.status(201).json(shop);
    } catch (error) {
      next(error);
    }
  }
);

shopsRouter.patch(
  "/:id/status",
  authenticate(),
  requireRole(["admin", "moderator"]),
  validateRequest(updateShopStatusSchema),
  async (req, res, next) => {
    try {
      const shop = await updateShopStatus({
        id: req.params.id,
        status: req.body.status,
      });

      res.json(shop);
    } catch (error) {
      next(error);
    }
  }
);

