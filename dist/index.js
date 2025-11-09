"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    const app = (0, app_1.createApp)();
    const port = env_1.env.PORT;
    app.listen(port, () => {
        logger_1.logger.info({ port }, "Server listening");
    });
}
bootstrap().catch((error) => {
    logger_1.logger.error({ err: error }, "Failed to start server");
    process.exit(1);
});
//# sourceMappingURL=index.js.map