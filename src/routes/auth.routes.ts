import { Router } from "express";
import { loginResident, registerResident } from "../services/auth.service";
import { validateRequest } from "../middleware/validate-request";
import { loginRequestSchema, registerRequestSchema } from "../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/register", validateRequest(registerRequestSchema), async (req, res, next) => {
  try {
    const result = await registerResident(req.body);
    res.status(201).json({
      userId: result.user.id,
      email: result.user.email,
      residentId: result.residentId,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateRequest(loginRequestSchema), async (req, res, next) => {
  try {
    const result = await loginResident(req.body);
    res.json({
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      resident: {
        id: result.resident.id,
        firstName: result.resident.first_name,
        lastName: result.resident.last_name,
        estateId: result.resident.estate_id,
        building: result.resident.building,
        staircase: result.resident.staircase,
        floor: result.resident.floor,
        apartment: result.resident.apartment,
        role: result.resident.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
});
