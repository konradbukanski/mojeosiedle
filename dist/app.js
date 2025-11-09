"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    app.disable("x-powered-by");
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(express_1.default.json({ limit: `${env_1.env.MEDIA_MAX_FILE_SIZE_MB}mb` }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
    app.get("/health", (_req, res) => {
        res.json({
            status: "ok",
            environment: env_1.env.APP_ENV,
            timestamp: new Date().toISOString(),
        });
    });
    (0, routes_1.registerRoutes)(app);
    app.use(error_handler_1.notFoundHandler);
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map