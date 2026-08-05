import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addMemberSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./projects.schema.js";
import { projectController } from "./projects.controller.js";
import {
  authorizeProjectCreator,
  checkProjectAccess,
} from "../../middlewares/checkProjectAccess.js";

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
  .patch(
    validate(updateProjectSchema),
    authorizeProjectCreator,
    projectController.updateProject,
  )
  .delete(authorizeProjectCreator, projectController.deleteProject);

router.get("/:projectId/members", projectController.getProjectMembers);

router.post(
  "/:projectId/members",
  validate(addMemberSchema),
  authorizeProjectCreator,
  projectController.addMember,
);

router.delete(
  "/:projectId/members/:userId",
  authorizeProjectCreator,
  projectController.removeMember,
);

export default router;
