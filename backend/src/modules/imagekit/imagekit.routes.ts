import { Router } from "express";
import { getAuthParameters } from "./imagekit.controller.js";

const router = Router();

router.get("/auth", getAuthParameters);

export default router;
