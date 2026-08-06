import { Router } from "express";

import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";
import {
  createTaskBodySchema,
  getAllTasksQuerySchema,
  updateTaskBodySchema,
} from "./task.schema.js";
import { validate } from "../../middlewares/validate.js";
import { taskController } from "./task.controller.js";

const router = Router();

router.use("/:projectId", checkProjectAccess);

router.post(
  "/:projectId",
  validate(createTaskBodySchema),
  taskController.createTask,
);

router.get(
  "/:projectId",
  validate(getAllTasksQuerySchema, "query"),
  taskController.getAllTasks,
);

router.get("/:projectId/:taskId", taskController.getTaskById);

router.patch(
  "/:projectId/:taskId",
  validate(updateTaskBodySchema),
  taskController.updateTask,
);

router.delete("/:projectId/:taskId", taskController.deleteTask);

export default router;
