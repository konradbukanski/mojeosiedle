import type { z } from "zod";
import { sendNotificationSchema } from "../schemas/notification.schema";
export type NotificationPayload = z.infer<typeof sendNotificationSchema>["body"];
export interface NotificationResult {
    successCount: number;
    failureCount: number;
}
export declare function dispatchNotification(payload: NotificationPayload): Promise<NotificationResult>;
//# sourceMappingURL=notification.service.d.ts.map