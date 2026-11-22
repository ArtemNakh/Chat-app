import express from "express";
import { env } from "./config/env.js";

export function createApp(): express.Express {
  const app = express();

  // Only trust proxy headers in production (behind a reverse proxy like nginx/cloudflare)
  if (env.NODE_ENV === "production") {
    app.set("trust proxy", env.TRUST_PROXY);
  }

  return app;
}
