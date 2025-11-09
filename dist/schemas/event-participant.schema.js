"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventParticipantSchema = exports.eventParticipantStatusSchema = void 0;
const zod_1 = require("zod");
exports.eventParticipantStatusSchema = zod_1.z.enum(["going", "interested", "not_going"]);
exports.eventParticipantSchema = zod_1.z.object({
    event_id: zod_1.z.string().uuid(),
    resident_id: zod_1.z.string().uuid(),
    status: exports.eventParticipantStatusSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=event-participant.schema.js.map