import { Router } from "express";

import { checkProjectAccess } from "../../middlewares/checkProjectAccess";
import {
  createTaskBodySchema,
  getAllTasksQuerySchema,
  updateTaskBodySchema,
} from "./task.schema";
import { validate } from "../../middlewares/validate";
import { taskController } from "./task.controller";

const router = Router();

/**
DELETE /:projectId/tasks/:taskId            → deleteTask
*/
router.post(
  "/:projectId",
  checkProjectAccess,
  validate(createTaskBodySchema),
  taskController.createTask,
);

router.get(
  "/:projectId",
  checkProjectAccess,
  validate(getAllTasksQuerySchema, "query"),
  taskController.getAllTasks,
);

router.get(
  "/:projectId/:taskId",
  checkProjectAccess,
  taskController.getTaskById,
);

router.patch(
  "/:projectId/:taskId",
  checkProjectAccess,
  validate(updateTaskBodySchema),
  taskController.updateTask,
);

router.delete(
  "/:projectId/:taskId",
  checkProjectAccess,
  taskController.deleteTask,
);

export default router;
