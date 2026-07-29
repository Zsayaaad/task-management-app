import { Router } from "express";

import { checkProjectAccess } from "../../middlewares/checkProjectAccess";

const router = Router();
// projects.routes.ts
/**

POST   /api/v1/projects/:projectId/tasks                    → createTask
GET    /api/v1/projects/:projectId/tasks                    → getAllTasks (+ filtering)
GET    /api/v1/projects/:projectId/tasks/:taskId            → getTaskById
PATCH  /api/v1/projects/:projectId/tasks/:taskId            → updateTask
DELETE /api/v1/projects/:projectId/tasks/:taskId            → deleteTask

*/

router.use("/:projectId", checkProjectAccess);

export default router;
