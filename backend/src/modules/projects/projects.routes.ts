import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addMemberSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./projects.schema.js";
import { projectController } from "./projects.controller.js";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";
import { requireAdmin } from "../../middlewares/auth.js";

const router = Router();
// projects.routes.ts
router
  .route("/")
  .post(validate(createProjectSchema), projectController.createProject)
  .get(projectController.getAllProjects);

router.use("/:projectId", checkProjectAccess);

router
  .route("/:projectId")
  .get(projectController.getProjectById)
  .patch(validate(updateProjectSchema), projectController.updateProject)
  .delete(projectController.deleteProject);

router.get(
  "/:projectId/members",
  projectController.getProjectMembers,
);

router.post(
  "/:projectId/members",
  requireAdmin,
  validate(addMemberSchema),
  projectController.addMember,
);

router.delete(
  "/:projectId/members/:userId",
  requireAdmin,
  projectController.removeMember,
);

export default router;
