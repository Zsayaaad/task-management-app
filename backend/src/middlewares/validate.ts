import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// middleware/validate.ts

type ValidationSource = "body" | "query" | "params";

export const validate =
  (schema: z.ZodTypeAny, source: ValidationSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const flattened = z.flattenError(result.error);

      return res.status(400).json({
        message: "Validation failed",
        errors: flattened.fieldErrors,
      });
    }

    if (source === "query") {
      req.validatedQuery = result.data as Record<string, unknown>;
    } else {
      req[source] = result.data;
    }

    next();
  };
