import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { createIssueSchema, updateIssueStatusSchema } from "../schemas/issue.schema";
import { createIssue, getIssueById, listIssues, updateIssueStatus } from "../services/issue.service";

export const issuesRouter = Router();

issuesRouter.get("/", authenticate(), async (req, res, next) => {
  try {
    const isModerator = req.user!.role === "moderator" || req.user!.role === "admin";
    const issues = await listIssues({
      estateId: req.user!.estateId,
      reporterId: isModerator ? undefined : req.user!.id,
      status: req.query.status as any,
      cursor: req.query.cursor as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    res.json(issues);
  } catch (error) {
    next(error);
  }
});

issuesRouter.get("/:id", authenticate(), async (req, res, next) => {
  try {
    const issue = await getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: { message: "Issue not found" } });
    }

    if (issue.reporter_id !== req.user!.id && req.user!.role === "resident") {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    res.json(issue);
  } catch (error) {
    next(error);
  }
});

issuesRouter.post(
  "/",
  authenticate(),
  validateRequest(createIssueSchema),
  async (req, res, next) => {
    try {
      const issue = await createIssue({
        estateId: req.user!.estateId,
        reporterId: req.user!.id,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        mediaIds: req.body.mediaIds,
      });

      res.status(201).json(issue);
    } catch (error) {
      next(error);
    }
  }
);

issuesRouter.patch(
  "/:id/status",
  authenticate(),
  requireRole(["moderator", "admin"]),
  validateRequest(updateIssueStatusSchema),
  async (req, res, next) => {
    try {
      const issue = await updateIssueStatus({
        id: req.params.id,
        status: req.body.status,
        assignedTo: req.body.assignedTo,
        resolutionNote: req.body.resolutionNote,
      });

      res.json(issue);
    } catch (error) {
      next(error);
    }
  }
);

