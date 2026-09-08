import { Router } from "express";
import { getAuthParameters } from "./imagekit.controller.js";
import { sensitiveLimiter } from "../../middlewares/rateLimiters.js";

const router = Router();

// Minting upload signatures is expensive/sensitive — limit it
router.get("/auth", sensitiveLimiter, getAuthParameters);

export default router;
