"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIssueStatusSchema = exports.createIssueSchema = exports.issueSchema = exports.issuePrioritySchema = exports.issueStatusSchema = void 0;
const zod_1 = require("zod");
exports.issueStatusSchema = zod_1.z.enum(["open", "in_progress", "resolved", "dismissed"]);
exports.issuePrioritySchema = zod_1.z.enum(["low", "medium", "high", "critical"]);
exports.issueSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    reporter_id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    priority: exports.issuePrioritySchema,
    status: exports.issueStatusSchema,
    assigned_to: zod_1.z.string().uuid().nullish(),
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.createIssueSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(160),
        description: zod_1.z.string().min(5),
        priority: exports.issuePrioritySchema.default("medium"),
        mediaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    })
        .strict(),
});
exports.updateIssueStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z
        .object({
        status: exports.issueStatusSchema,
        assignedTo: zod_1.z.string().uuid().optional(),
        resolutionNote: zod_1.z.string().max(500).optional(),
    })
        .strict(),
});
//# sourceMappingURL=issue.schema.js.map