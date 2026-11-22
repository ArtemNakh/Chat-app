import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

export function createApp(): express.Express {
  const app = express();

  // Only trust proxy headers in production (behind a reverse proxy like nginx/cloudflare)
  if (env.NODE_ENV === "production") {
    app.set("trust proxy", env.TRUST_PROXY);
  }

  // Request protection recommendations
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(globalLimiter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
