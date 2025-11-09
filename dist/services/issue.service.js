"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssue = createIssue;
exports.listIssues = listIssues;
exports.updateIssueStatus = updateIssueStatus;
exports.getIssueById = getIssueById;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const issue_schema_1 = require("../schemas/issue.schema");
const supabase_service_1 = require("./supabase.service");
const media_service_1 = require("./media.service");
async function createIssue(input) {
    const response = await supabase_1.supabaseAdmin
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
    const issue = issue_schema_1.issueSchema.parse((0, supabase_service_1.unwrap)(response));
    if (input.mediaIds?.length) {
        await (0, media_service_1.attachMediaAssets)(input.mediaIds, "issue", issue.id);
    }
    return issue;
}
async function listIssues(options) {
    const limit = options.limit ?? 20;
    let query = supabase_1.supabaseAdmin
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
    const data = (0, supabase_service_1.unwrap)(response);
    const items = data.slice(0, limit).map((record) => issue_schema_1.issueSchema.parse(record));
    const nextCursor = data.length > limit ? data[limit].created_at : null;
    return { items, nextCursor };
}
async function updateIssueStatus(input) {
    const response = await supabase_1.supabaseAdmin
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
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    return issue_schema_1.issueSchema.parse(response.data);
}
async function getIssueById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("issue_reports")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (!response.data) {
        return null;
    }
    return issue_schema_1.issueSchema.parse(response.data);
}
//# sourceMappingURL=issue.service.js.map