"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchNotification = dispatchNotification;
const firebase_1 = require("../config/firebase");
const app_error_1 = require("../utils/app-error");
const push_token_service_1 = require("./push-token.service");
const logger_1 = require("../utils/logger");
const MAX_FCM_TOKENS_PER_BATCH = 500;
function chunk(items, size) {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size));
    }
    return result;
}
async function dispatchNotification(payload) {
    const messaging = (0, firebase_1.getFirebaseMessaging)();
    if (!messaging) {
        throw new app_error_1.AppError("Push notifications are not configured", 503);
    }
    const notification = {
        title: payload.title,
        body: payload.body,
    };
    switch (payload.target.type) {
        case "estate": {
            const tokens = await (0, push_token_service_1.listEstatePushTokens)(payload.target.estateId);
            if (tokens.length === 0) {
                return { successCount: 0, failureCount: 0 };
            }
            let successCount = 0;
            let failureCount = 0;
            for (const batch of chunk(tokens, MAX_FCM_TOKENS_PER_BATCH)) {
                const response = await messaging.sendEachForMulticast({
                    tokens: batch.map((token) => token.fcm_token),
                    notification,
                    data: payload.data,
                });
                successCount += response.successCount;
                failureCount += response.failureCount;
            }
            return { successCount, failureCount };
        }
        case "residents": {
            const tokens = await (0, push_token_service_1.listTokensByResidentIds)(payload.target.residentIds);
            if (tokens.length === 0) {
                return { successCount: 0, failureCount: 0 };
            }
            let successCount = 0;
            let failureCount = 0;
            for (const batch of chunk(tokens, MAX_FCM_TOKENS_PER_BATCH)) {
                const response = await messaging.sendEachForMulticast({
                    tokens: batch.map((token) => token.fcm_token),
                    notification,
                    data: payload.data,
                });
                successCount += response.successCount;
                failureCount += response.failureCount;
            }
            return { successCount, failureCount };
        }
        case "topic": {
            try {
                await messaging.send({
                    topic: payload.target.topic,
                    notification,
                    data: payload.data,
                });
                return { successCount: 1, failureCount: 0 };
            }
            catch (error) {
                logger_1.logger.error({ err: error }, "Failed to send topic notification");
                throw new app_error_1.AppError("Failed to send topic notification", 500, { details: error });
            }
        }
        default:
            return { successCount: 0, failureCount: 0 };
    }
}
//# sourceMappingURL=notification.service.js.map