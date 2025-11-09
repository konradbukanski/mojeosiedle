import type { z } from "zod";
import { issueSchema, issueStatusSchema, issuePrioritySchema } from "../schemas/issue.schema";
export type Issue = z.infer<typeof issueSchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;
export type IssuePriority = z.infer<typeof issuePrioritySchema>;
interface CreateIssueInput {
    estateId: string;
    reporterId: string;
    title: string;
    description: string;
    priority: IssuePriority;
    mediaIds?: string[];
}
interface ListIssuesOptions {
    estateId: string;
    status?: IssueStatus;
    reporterId?: string;
    limit?: number;
    cursor?: string;
}
interface UpdateIssueStatusInput {
    id: string;
    status: IssueStatus;
    assignedTo?: string;
    resolutionNote?: string;
}
export declare function createIssue(input: CreateIssueInput): Promise<Issue>;
export declare function listIssues(options: ListIssuesOptions): Promise<{
    items: {
        id: string;
        estate_id: string;
        reporter_id: string;
        title: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
        status: "open" | "in_progress" | "resolved" | "dismissed";
        created_at: string;
        updated_at: string;
        assigned_to?: string | null | undefined;
    }[];
    nextCursor: any;
}>;
export declare function updateIssueStatus(input: UpdateIssueStatusInput): Promise<Issue>;
export declare function getIssueById(id: string): Promise<Issue | null>;
export {};
//# sourceMappingURL=issue.service.d.ts.map