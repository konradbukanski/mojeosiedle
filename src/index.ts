import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function bootstrap() {
  const app = createApp();
  const port = env.PORT;

  app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Failed to start server");
  process.exit(1);
});

