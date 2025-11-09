import type { z } from "zod";
import { getFirebaseMessaging } from "../config/firebase";
import { AppError } from "../utils/app-error";
import { sendNotificationSchema } from "../schemas/notification.schema";
import { listEstatePushTokens, listTokensByResidentIds } from "./push-token.service";
import { logger } from "../utils/logger";

const MAX_FCM_TOKENS_PER_BATCH = 500;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export type NotificationPayload = z.infer<typeof sendNotificationSchema>["body"];

export interface NotificationResult {
  successCount: number;
  failureCount: number;
}

export async function dispatchNotification(payload: NotificationPayload): Promise<NotificationResult> {
  const messaging = getFirebaseMessaging();
  if (!messaging) {
    throw new AppError("Push notifications are not configured", 503);
  }

  const notification = {
    title: payload.title,
    body: payload.body,
  } as const;

  switch (payload.target.type) {
    case "estate": {
      const tokens = await listEstatePushTokens(payload.target.estateId);
      if (tokens.length === 0) {
        return { successCount: 0, failureCount: 0 };
      }

      let successCount = 0;
      let failureCount = 0;

      for (const batch of chunk(tokens, MAX_FCM_TOKENS_PER_BATCH)) {
        const response = await messaging.sendEachForMulticast({
          tokens: batch.map((token) => token.fcm_token),
          notification,
          data: payload.data,
        });
        successCount += response.successCount;
        failureCount += response.failureCount;
      }

      return { successCount, failureCount };
    }
    case "residents": {
      const tokens = await listTokensByResidentIds(payload.target.residentIds);
      if (tokens.length === 0) {
        return { successCount: 0, failureCount: 0 };
      }

      let successCount = 0;
      let failureCount = 0;

      for (const batch of chunk(tokens, MAX_FCM_TOKENS_PER_BATCH)) {
        const response = await messaging.sendEachForMulticast({
          tokens: batch.map((token) => token.fcm_token),
          notification,
          data: payload.data,
        });
        successCount += response.successCount;
        failureCount += response.failureCount;
      }

      return { successCount, failureCount };
    }
    case "topic": {
      try {
        await messaging.send({
          topic: payload.target.topic,
          notification,
          data: payload.data,
        });
        return { successCount: 1, failureCount: 0 };
      } catch (error) {
        logger.error({ err: error }, "Failed to send topic notification");
        throw new AppError("Failed to send topic notification", 500, { details: error });
      }
    }
    default:
      return { successCount: 0, failureCount: 0 };
  }
}

