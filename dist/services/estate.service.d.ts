interface EstateRecord {
    id: string;
    name: string;
    city: string | null;
    address: string | null;
}
export declare function listEstates(): Promise<EstateRecord[]>;
export {};
//# sourceMappingURL=estate.service.d.ts.map