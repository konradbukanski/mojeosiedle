import { z } from "zod";

export const issueStatusSchema = z.enum(["open", "in_progress", "resolved", "dismissed"]);
export const issuePrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const issueSchema = z.object({
  id: z.string().uuid(),
  estate_id: z.string().uuid(),
  reporter_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  priority: issuePrioritySchema,
  status: issueStatusSchema,
  assigned_to: z.string().uuid().nullish(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createIssueSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(160),
      description: z.string().min(5),
      priority: issuePrioritySchema.default("medium"),
      mediaIds: z.array(z.string().uuid()).optional(),
    })
    .strict(),
});

export const updateIssueStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      status: issueStatusSchema,
      assignedTo: z.string().uuid().optional(),
      resolutionNote: z.string().max(500).optional(),
    })
    .strict(),
});
