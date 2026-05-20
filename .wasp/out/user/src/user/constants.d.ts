type UserMenuItem = {
    name: string;
    to: string;
    icon: any;
    isAuthRequired: boolean;
    isAdminOnly?: boolean;
    isProviderOnly?: boolean;
    isConsumerOnly?: boolean;
};
export declare const userMenuItems: UserMenuItem[];
export {};
