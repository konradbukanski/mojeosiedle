import { type PushTokenRecord } from "../schemas/push-token-record.schema";
import type { PushPlatform } from "../schemas/push-token.schema";
interface RegisterPushTokenInput {
    residentId: string;
    estateId: string;
    token: string;
    platform: PushPlatform;
    device?: string;
}
export declare function registerPushToken(input: RegisterPushTokenInput): Promise<PushTokenRecord>;
export declare function listEstatePushTokens(estateId: string): Promise<PushTokenRecord[]>;
export declare function listTokensByResidentIds(residentIds: string[]): Promise<PushTokenRecord[]>;
export {};
//# sourceMappingURL=push-token.service.d.ts.map