import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { createProjectSchema } from "./projects.schema";
import { projectController } from "./projects.controller";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess";

const router = Router();
// projects.routes.ts
router
  .route("/")
  .post(validate(createProjectSchema), projectController.createProject)
  .get(projectController.getAllProjects);

router.use("/:projectId", checkProjectAccess);

router.route("/:projectId").get(projectController.getProjectById);

// router.get("/:projectId", checkProjectAccess, getProjectController);
// router.patch("/:projectId", checkProjectAccess, updateProjectController);
// router.delete("/:projectId", checkProjectAccess, deleteProjectController);

// // وحتى الـ tasks routes (لو nested جوا project)
// router.get("/:projectId/tasks", checkProjectAccess, getTasksController);

export default router;
