import { Router } from "express";
import { validate } from "../../middlewares/validate";
import {
  addMemberSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./projects.schema";
import { projectController } from "./projects.controller";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess";
import { requireAdmin } from "../../middlewares/auth";

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

router.post(
  "/:projectId/members",
  requireAdmin,
  validate(addMemberSchema),
  projectController.addMember,
);

// router.get("/:projectId", checkProjectAccess, getProjectController);
// router.patch("/:projectId", checkProjectAccess, updateProjectController);
// router.delete("/:projectId", checkProjectAccess, deleteProjectController);

// // وحتى الـ tasks routes (لو nested جوا project)
// router.get("/:projectId/tasks", checkProjectAccess, getTasksController);

export default router;
