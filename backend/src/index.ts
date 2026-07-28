import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/prisma";
import { getEnv } from "./lib/env";

// routes
import authRoutes from "./modules/auth/auth.routes";
import userRouter from "./modules/users/user.routes";
import projectRouter from "./modules/projects/projects.routes";

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authenticatedUser, userRouter);
app.use("/api/v1/products", authenticatedUser, projectRouter);

// Global Error Handler
// TRIGGERED BY OUR EXISTING ROUTES IF THERE IS A VALID REQUEST AND HAS AN ERROR
app.use(errorHandlerMiddleware);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}...`);
});
