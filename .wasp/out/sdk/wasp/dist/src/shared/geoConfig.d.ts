export type CityZone = {
    name: string;
    prefixes: string[];
    active: boolean;
};
export declare const SERVICE_ZONES: CityZone[];
export declare const ACTIVE_PREFIXES: Set<string>;
export declare const getCityForPrefix: (prefix: string) => string | null;
//# sourceMappingURL=geoConfig.d.ts.map