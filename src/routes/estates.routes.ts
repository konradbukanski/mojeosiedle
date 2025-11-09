import { Router } from "express";
import { listEstates } from "../services/estate.service";

export const estatesRouter = Router();

estatesRouter.get("/", async (_req, res, next) => {
  try {
    const estates = await listEstates();
    res.json({ estates });
  } catch (error) {
    next(error);
  }
});

