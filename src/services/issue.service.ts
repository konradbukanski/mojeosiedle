import type { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { issueSchema, issueStatusSchema, issuePrioritySchema } from "../schemas/issue.schema";
import { unwrap } from "./supabase.service";
import { attachMediaAssets } from "./media.service";

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

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const response = await supabaseAdmin
    .from("issue_reports")
    .insert({
      estate_id: input.estateId,
      reporter_id: input.reporterId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "open",
    })
    .select("*")
    .single();

  const issue = issueSchema.parse(unwrap(response));

  if (input.mediaIds?.length) {
    await attachMediaAssets(input.mediaIds, "issue", issue.id);
  }

  return issue;
}

export async function listIssues(options: ListIssuesOptions) {
  const limit = options.limit ?? 20;

  let query = supabaseAdmin
    .from("issue_reports")
    .select("*")
    .eq("estate_id", options.estateId)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.reporterId) {
    query = query.eq("reporter_id", options.reporterId);
  }

  if (options.cursor) {
    query = query.lt("created_at", options.cursor);
  }

  const response = await query;
  const data = unwrap(response);

  const items = data.slice(0, limit).map((record) => issueSchema.parse(record));
  const nextCursor = data.length > limit ? data[limit].created_at : null;

  return { items, nextCursor };
}

export async function updateIssueStatus(input: UpdateIssueStatusInput): Promise<Issue> {
  const response = await supabaseAdmin
    .from("issue_reports")
    .update({
      status: input.status,
      assigned_to: input.assignedTo ?? null,
      resolution_note: input.resolutionNote ?? null,
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  return issueSchema.parse(response.data);
}

export async function getIssueById(id: string): Promise<Issue | null> {
  const response = await supabaseAdmin
    .from("issue_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (!response.data) {
    return null;
  }

  return issueSchema.parse(response.data);
}

