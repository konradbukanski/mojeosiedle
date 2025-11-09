"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseApp = getFirebaseApp;
exports.getFirebaseMessaging = getFirebaseMessaging;
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let firebaseApp = null;
let messagingInstance = null;
function getFirebaseApp() {
    if (firebaseApp) {
        return firebaseApp;
    }
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env_1.env;
    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        logger_1.logger.warn("Firebase credentials missing; push notifications are disabled.");
        return null;
    }
    if ((0, app_1.getApps)().length) {
        firebaseApp = (0, app_1.getApps)()[0];
        return firebaseApp;
    }
    firebaseApp = (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY,
        }),
    });
    return firebaseApp;
}
function getFirebaseMessaging() {
    if (messagingInstance) {
        return messagingInstance;
    }
    const app = getFirebaseApp();
    if (!app) {
        return null;
    }
    messagingInstance = (0, messaging_1.getMessaging)(app);
    return messagingInstance;
}
//# sourceMappingURL=firebase.js.map