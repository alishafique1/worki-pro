import { type DailyStats, type PageViewSource } from "wasp/entities";
import { type GetDailyStats, type GetAdminLiveCounts } from "wasp/server/operations";
type DailyStatsWithSources = DailyStats & {
    sources: PageViewSource[];
};
type DailyStatsValues = {
    dailyStats: DailyStatsWithSources;
    weeklyStats: DailyStatsWithSources[];
};
export declare const getDailyStats: GetDailyStats<void, DailyStatsValues | null>;
export type AdminLiveCounts = {
    pendingProviders: number;
    verifiedProviders: number;
    pendingReviews: number;
    requestsToday: number;
    pipeline: {
        new: number;
        qualified: number;
        assigned: number;
        booked: number;
        completed: number;
    };
    requestsByDay: {
        label: string;
        count: number;
    }[];
};
export declare const getAdminLiveCounts: GetAdminLiveCounts<void, AdminLiveCounts>;
export {};
//# sourceMappingURL=operations.d.ts.map