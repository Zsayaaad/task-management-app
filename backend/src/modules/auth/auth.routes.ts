import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authController } from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
