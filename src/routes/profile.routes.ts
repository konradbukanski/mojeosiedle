import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { ensureResident, updateResident } from "../services/resident.service";
import { validateRequest } from "../middleware/validate-request";
import { updateResidentProfileSchema, updateResidentLocationSchema } from "../schemas/resident.schema";

export const profileRouter = Router();

profileRouter.get("/me", authenticate(), async (req, res, next) => {
  try {
    const resident = await ensureResident(req.user!.authUserId);
    res.json({
      id: resident.id,
      firstName: resident.first_name,
      lastName: resident.last_name,
      estateId: resident.estate_id,
      building: resident.building,
      staircase: resident.staircase,
      floor: resident.floor,
      apartment: resident.apartment,
      role: resident.role,
    });
  } catch (error) {
    next(error);
  }
});

profileRouter.patch("/me", authenticate(), validateRequest(updateResidentProfileSchema), async (req, res, next) => {
  try {
    const updates = req.body;
    const resident = await updateResident(req.user!.id, {
      first_name: updates.firstName,
      last_name: updates.lastName,
      building: updates.building ?? undefined,
      staircase: updates.staircase ?? undefined,
      floor: updates.floor ?? undefined,
      apartment: updates.apartment ?? undefined,
    });

    res.json({
      id: resident.id,
      firstName: resident.first_name,
      lastName: resident.last_name,
      building: resident.building,
      staircase: resident.staircase,
      floor: resident.floor,
      apartment: resident.apartment,
    });
  } catch (error) {
    next(error);
  }
});

profileRouter.patch(
  "/me/location",
  authenticate(),
  validateRequest(updateResidentLocationSchema),
  async (req, res, next) => {
    try {
      const updates = req.body;
      const resident = await updateResident(req.user!.id, {
        building: updates.building,
        staircase: updates.staircase ?? undefined,
        floor: updates.floor ?? undefined,
        apartment: updates.apartment ?? undefined,
      });

      res.json({
        id: resident.id,
        building: resident.building,
        staircase: resident.staircase,
        floor: resident.floor,
        apartment: resident.apartment,
      });
    } catch (error) {
      next(error);
    }
  }
);

