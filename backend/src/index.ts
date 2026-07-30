import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import fs from "node:fs";
import path from "node:path";

import { connectDB } from "./lib/prisma";
import { getEnv } from "./lib/env";

// routes
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/users/user.routes";
import projectRouter from "./modules/projects/projects.routes";
import taskRouter from "./modules/tasks/task.routes";

// middlewares
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import { authenticatedUser } from "./middlewares/auth";

const env = getEnv();

connectDB();

const app = express();

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// app.post("/webhooks/polar", rawJson, (req, res) => {});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticatedUser, userRouter);
app.use("/api/v1/projects", authenticatedUser, projectRouter);
app.use("/api/v1/tasks", authenticatedUser, taskRouter);

// Global Error Handler
// TRIGGERED BY OUR EXISTING ROUTES IF THERE IS A VALID REQUEST AND HAS AN ERROR
app.use(errorHandlerMiddleware);

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}...`);
});
