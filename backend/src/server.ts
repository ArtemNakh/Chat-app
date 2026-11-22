import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const server = createServer(app);

// async function shutdown(): Promise<void> {
//   // server.close(async ()={await disconnectDatabase();process.exit(0)})

//   // Force shutdown after 10 seconds if graceful fails
//   setTimeout(() => {
//     // logger.error("Graceful shutdown timed out — forcing exit");
//     process.exit(1);
//   }, 10_000);
// }

// process.on("SIGINT", () => void shutdown("SIGINT"));
// process.on("SIGTERM", () => void shutdown("SIGTERM"));

server.listen(env.PORT, () => {});
