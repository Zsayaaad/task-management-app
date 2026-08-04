import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authController } from "./auth.controller.js";
// import rateLimit from "express-rate-limit";

const router = Router();

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 3,
//   message: { msg: "IP rate limit exceeded, retry in 15min" },
// });

router.post(
  "/register",
  // apiLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  // apiLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/logout", authController.logout);

export default router;
