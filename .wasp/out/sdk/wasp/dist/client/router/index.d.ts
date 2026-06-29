import type { RouteDefinitionsToRoutes, OptionalRouteOptions, ParamValue } from './types';
export declare const routes: {
    readonly LandingPageRoute: {
        readonly to: "/";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly RequestSuccessRoute: {
        readonly to: "/request-success";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly HvacRoute: {
        readonly to: "/hvac";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly HandymanRoute: {
        readonly to: "/handyman";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ApplianceRoute: {
        readonly to: "/appliance-repair";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly SmartHomeRoute: {
        readonly to: "/smart-home";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly PlumbingRoute: {
        readonly to: "/plumbing";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ElectricalRoute: {
        readonly to: "/electrical";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly HowRewardsWorkRoute: {
        readonly to: "/how-rewards-work";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AreaRoute: {
        readonly to: "/areas/:areaSlug";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "areaSlug": ParamValue;
            };
        }) => string;
    };
    readonly ProviderLandingRoute: {
        readonly to: "/providers";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderApplyRoute: {
        readonly to: "/providers/apply";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly TermsRoute: {
        readonly to: "/terms";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly PrivacyRoute: {
        readonly to: "/privacy";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly OnboardingRoute: {
        readonly to: "/onboarding";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly LoginRoute: {
        readonly to: "/login";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly SignupRoute: {
        readonly to: "/signup";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly RequestPasswordResetRoute: {
        readonly to: "/request-password-reset";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly PasswordResetRoute: {
        readonly to: "/password-reset";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly EmailVerificationRoute: {
        readonly to: "/email-verification";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly RequestServiceRoute: {
        readonly to: "/request-service";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountRequestServiceRoute: {
        readonly to: "/account/request-service";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly GuestRequestWizardRoute: {
        readonly to: "/get-quotes";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly CategoryLandingRoute: {
        readonly to: "/services/:categorySlug";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "categorySlug": ParamValue;
            };
        }) => string;
    };
    readonly BookingRoute: {
        readonly to: "/book/:requestId";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly AccountBookRoute: {
        readonly to: "/account/book/:requestId";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly DashboardRoute: {
        readonly to: "/dashboard";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountHomeRoute: {
        readonly to: "/account";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly MyRequestsRoute: {
        readonly to: "/my-requests";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountRequestsRoute: {
        readonly to: "/account/requests";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly RequestDetailRoute: {
        readonly to: "/my-requests/:requestId";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly AccountRequestDetailRoute: {
        readonly to: "/account/requests/:requestId";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly RewardsRoute: {
        readonly to: "/rewards";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountRewardsRoute: {
        readonly to: "/account/rewards";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly HelpRoute: {
        readonly to: "/help";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ReferralRoute: {
        readonly to: "/referral";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountReferralsRoute: {
        readonly to: "/account/referrals";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AnalyticsRoute: {
        readonly to: "/analytics";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AccountActivityRoute: {
        readonly to: "/account/activity";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly DiscoveryRoute: {
        readonly to: "/discover";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ConsumerServicesRoute: {
        readonly to: "/services";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly HowItWorksRoute: {
        readonly to: "/how-it-works";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderDetailRoute: {
        readonly to: "/pro/:providerId";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "providerId": ParamValue;
            };
        }) => string;
    };
    readonly ContactRoute: {
        readonly to: "/contact";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly RequestMessagesRoute: {
        readonly to: "/my-requests/:requestId/messages";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly AccountRequestMessagesRoute: {
        readonly to: "/account/requests/:requestId/messages";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly SubmitReviewRoute: {
        readonly to: "/my-requests/:requestId/review";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly AccountRequestReviewRoute: {
        readonly to: "/account/requests/:requestId/review";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly ServiceAreaRoute: {
        readonly to: "/services/:serviceSlug/:areaSlug";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "serviceSlug": ParamValue;
                "areaSlug": ParamValue;
            };
        }) => string;
    };
    readonly ProPublicRoute: {
        readonly to: "/pro-public/:slug";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "slug": ParamValue;
            };
        }) => string;
    };
    readonly ProsRoute: {
        readonly to: "/pros/:slug";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "slug": ParamValue;
            };
        }) => string;
    };
    readonly ProviderDashboardRoute: {
        readonly to: "/provider/dashboard";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderLeadsRoute: {
        readonly to: "/provider/leads";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderAppointmentsRoute: {
        readonly to: "/provider/appointments";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderProfileRoute: {
        readonly to: "/provider/profile";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderBillingRoute: {
        readonly to: "/provider/billing";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderServicesRoute: {
        readonly to: "/provider/services";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ProviderRequestMessagesRoute: {
        readonly to: "/provider/requests/:requestId/messages";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "requestId": ParamValue;
            };
        }) => string;
    };
    readonly AccountRoute: {
        readonly to: "/account/profile";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminRoute: {
        readonly to: "/admin";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminUsersRoute: {
        readonly to: "/admin/users";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminRequestsRoute: {
        readonly to: "/admin/requests";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminProvidersRoute: {
        readonly to: "/admin/providers";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminRewardsRoute: {
        readonly to: "/admin/rewards";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminReviewsRoute: {
        readonly to: "/admin/reviews";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminCategoriesRoute: {
        readonly to: "/admin/categories";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminSettingsRoute: {
        readonly to: "/admin/settings";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminCalendarRoute: {
        readonly to: "/admin/calendar";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminUIButtonsRoute: {
        readonly to: "/admin/ui/buttons";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly NotFoundRoute: {
        readonly to: "*";
        readonly build: (options: OptionalRouteOptions & {
            params: {
                "*": ParamValue;
            };
        }) => string;
    };
    readonly AdminMessagesRoute: {
        readonly to: "/admin/messages";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
};
export type Routes = RouteDefinitionsToRoutes<typeof routes>;
export { Link } from './Link';
//# sourceMappingURL=index.d.ts.map