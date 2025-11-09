import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { createPresignedUrlSchema } from "../schemas/media.schema";
import { createPresignedUploadUrl } from "../services/media.service";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

export const mediaRouter = Router();

mediaRouter.post(
  "/presign",
  authenticate(),
  validateRequest(createPresignedUrlSchema),
  async (req, res, next) => {
    try {
      const { fileName, fileType, fileSize, entityType, entityId } = req.body;

      const maxBytes = env.MEDIA_MAX_FILE_SIZE_MB * 1024 * 1024;
      if (fileSize > maxBytes) {
        throw new AppError(`File exceeds maximum size of ${env.MEDIA_MAX_FILE_SIZE_MB}MB`, 413);
      }

      const result = await createPresignedUploadUrl({
        fileName,
        fileType,
        fileSize,
        entityType,
        entityId,
        uploaderId: req.user!.id,
        estateId: req.user!.estateId,
      });

      res.status(201).json({
        asset: {
          id: result.asset.id,
          storagePath: result.asset.storage_path,
          status: result.asset.status,
        },
        signedUrl: result.signedUrl,
        uploadToken: result.uploadToken,
        path: result.path,
      });
    } catch (error) {
      next(error);
    }
  }
);

