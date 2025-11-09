import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import { env } from "./env";
import { logger } from "../utils/logger";

let firebaseApp: App | null = null;
let messagingInstance: Messaging | null = null;

export function getFirebaseApp(): App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    logger.warn("Firebase credentials missing; push notifications are disabled.");
    return null;
  }

  if (getApps().length) {
    firebaseApp = getApps()[0] as App;
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    }),
  });

  return firebaseApp;
}

export function getFirebaseMessaging(): Messaging | null {
  if (messagingInstance) {
    return messagingInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  messagingInstance = getMessaging(app);
  return messagingInstance;
}

