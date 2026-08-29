import { Router } from "express";
import { generateStreamToken } from "./stream.controller.js";

const router = Router();

router.get("/token", generateStreamToken);

export default router;
