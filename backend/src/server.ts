import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const app = createApp();
const server = createServer(app);

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Shutdown signal received — cleaning up");
  server.close(async () => {
    // await disconnectDatabase();
    logger.info("Server closed");
    process.exit(0);
  });

  // Force shutdown after 10 seconds if graceful fails
  setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000);
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

server.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, env: env.NODE_ENV },
    `Server running on http://localhost:${String(env.PORT)}`,
  );
});
