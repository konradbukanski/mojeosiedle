"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationSchema = void 0;
const zod_1 = require("zod");
const notificationTargetSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({ type: zod_1.z.literal("estate"), estateId: zod_1.z.string().uuid() }),
    zod_1.z.object({ type: zod_1.z.literal("residents"), residentIds: zod_1.z.array(zod_1.z.string().uuid()).min(1) }),
    zod_1.z.object({ type: zod_1.z.literal("topic"), topic: zod_1.z.string().min(1) }),
]);
exports.sendNotificationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1),
        body: zod_1.z.string().min(1),
        target: notificationTargetSchema,
        data: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    })
        .strict(),
});
//# sourceMappingURL=notification.schema.js.map