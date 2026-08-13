import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  if (!env.skipDb) {
    await connectDb();
  } else {
    logger.warn("SKIP_DB=true, starting server without MongoDB connection.");
  }
  const server = app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${env.port} is already in use. Stop the existing process or change PORT in .env.`);
      process.exit(1);
    }
    throw error;
  });
};

startServer();