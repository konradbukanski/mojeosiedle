import { z } from "zod";
export declare const issueStatusSchema: z.ZodEnum<{
    open: "open";
    in_progress: "in_progress";
    resolved: "resolved";
    dismissed: "dismissed";
}>;
export declare const issuePrioritySchema: z.ZodEnum<{
    low: "low";
    medium: "medium";
    high: "high";
    critical: "critical";
}>;
export declare const issueSchema: z.ZodObject<{
    id: z.ZodString;
    estate_id: z.ZodString;
    reporter_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        critical: "critical";
    }>;
    status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        resolved: "resolved";
        dismissed: "dismissed";
    }>;
    assigned_to: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const createIssueSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            critical: "critical";
        }>>;
        mediaIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const updateIssueStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            resolved: "resolved";
            dismissed: "dismissed";
        }>;
        assignedTo: z.ZodOptional<z.ZodString>;
        resolutionNote: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strip>;
//# sourceMappingURL=issue.schema.d.ts.map