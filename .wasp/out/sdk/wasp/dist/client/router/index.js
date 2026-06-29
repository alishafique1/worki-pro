import { interpolatePath } from './linkHelpers';
// PUBLIC API
export const routes = {
    LandingPageRoute: {
        to: "/",
        build: (options) => interpolatePath("/", undefined, options?.search, options?.hash),
    },
    RequestSuccessRoute: {
        to: "/request-success",
        build: (options) => interpolatePath("/request-success", undefined, options?.search, options?.hash),
    },
    HvacRoute: {
        to: "/hvac",
        build: (options) => interpolatePath("/hvac", undefined, options?.search, options?.hash),
    },
    HandymanRoute: {
        to: "/handyman",
        build: (options) => interpolatePath("/handyman", undefined, options?.search, options?.hash),
    },
    ApplianceRoute: {
        to: "/appliance-repair",
        build: (options) => interpolatePath("/appliance-repair", undefined, options?.search, options?.hash),
    },
    SmartHomeRoute: {
        to: "/smart-home",
        build: (options) => interpolatePath("/smart-home", undefined, options?.search, options?.hash),
    },
    PlumbingRoute: {
        to: "/plumbing",
        build: (options) => interpolatePath("/plumbing", undefined, options?.search, options?.hash),
    },
    ElectricalRoute: {
        to: "/electrical",
        build: (options) => interpolatePath("/electrical", undefined, options?.search, options?.hash),
    },
    HowRewardsWorkRoute: {
        to: "/how-rewards-work",
        build: (options) => interpolatePath("/how-rewards-work", undefined, options?.search, options?.hash),
    },
    AreaRoute: {
        to: "/areas/:areaSlug",
        build: (options) => interpolatePath("/areas/:areaSlug", options.params, options?.search, options?.hash),
    },
    ProviderLandingRoute: {
        to: "/providers",
        build: (options) => interpolatePath("/providers", undefined, options?.search, options?.hash),
    },
    ProviderApplyRoute: {
        to: "/providers/apply",
        build: (options) => interpolatePath("/providers/apply", undefined, options?.search, options?.hash),
    },
    TermsRoute: {
        to: "/terms",
        build: (options) => interpolatePath("/terms", undefined, options?.search, options?.hash),
    },
    PrivacyRoute: {
        to: "/privacy",
        build: (options) => interpolatePath("/privacy", undefined, options?.search, options?.hash),
    },
    OnboardingRoute: {
        to: "/onboarding",
        build: (options) => interpolatePath("/onboarding", undefined, options?.search, options?.hash),
    },
    LoginRoute: {
        to: "/login",
        build: (options) => interpolatePath("/login", undefined, options?.search, options?.hash),
    },
    SignupRoute: {
        to: "/signup",
        build: (options) => interpolatePath("/signup", undefined, options?.search, options?.hash),
    },
    RequestPasswordResetRoute: {
        to: "/request-password-reset",
        build: (options) => interpolatePath("/request-password-reset", undefined, options?.search, options?.hash),
    },
    PasswordResetRoute: {
        to: "/password-reset",
        build: (options) => interpolatePath("/password-reset", undefined, options?.search, options?.hash),
    },
    EmailVerificationRoute: {
        to: "/email-verification",
        build: (options) => interpolatePath("/email-verification", undefined, options?.search, options?.hash),
    },
    RequestServiceRoute: {
        to: "/request-service",
        build: (options) => interpolatePath("/request-service", undefined, options?.search, options?.hash),
    },
    AccountRequestServiceRoute: {
        to: "/account/request-service",
        build: (options) => interpolatePath("/account/request-service", undefined, options?.search, options?.hash),
    },
    GuestRequestWizardRoute: {
        to: "/get-quotes",
        build: (options) => interpolatePath("/get-quotes", undefined, options?.search, options?.hash),
    },
    CategoryLandingRoute: {
        to: "/services/:categorySlug",
        build: (options) => interpolatePath("/services/:categorySlug", options.params, options?.search, options?.hash),
    },
    BookingRoute: {
        to: "/book/:requestId",
        build: (options) => interpolatePath("/book/:requestId", options.params, options?.search, options?.hash),
    },
    AccountBookRoute: {
        to: "/account/book/:requestId",
        build: (options) => interpolatePath("/account/book/:requestId", options.params, options?.search, options?.hash),
    },
    DashboardRoute: {
        to: "/dashboard",
        build: (options) => interpolatePath("/dashboard", undefined, options?.search, options?.hash),
    },
    AccountHomeRoute: {
        to: "/account",
        build: (options) => interpolatePath("/account", undefined, options?.search, options?.hash),
    },
    MyRequestsRoute: {
        to: "/my-requests",
        build: (options) => interpolatePath("/my-requests", undefined, options?.search, options?.hash),
    },
    AccountRequestsRoute: {
        to: "/account/requests",
        build: (options) => interpolatePath("/account/requests", undefined, options?.search, options?.hash),
    },
    RequestDetailRoute: {
        to: "/my-requests/:requestId",
        build: (options) => interpolatePath("/my-requests/:requestId", options.params, options?.search, options?.hash),
    },
    AccountRequestDetailRoute: {
        to: "/account/requests/:requestId",
        build: (options) => interpolatePath("/account/requests/:requestId", options.params, options?.search, options?.hash),
    },
    RewardsRoute: {
        to: "/rewards",
        build: (options) => interpolatePath("/rewards", undefined, options?.search, options?.hash),
    },
    AccountRewardsRoute: {
        to: "/account/rewards",
        build: (options) => interpolatePath("/account/rewards", undefined, options?.search, options?.hash),
    },
    HelpRoute: {
        to: "/help",
        build: (options) => interpolatePath("/help", undefined, options?.search, options?.hash),
    },
    ReferralRoute: {
        to: "/referral",
        build: (options) => interpolatePath("/referral", undefined, options?.search, options?.hash),
    },
    AccountReferralsRoute: {
        to: "/account/referrals",
        build: (options) => interpolatePath("/account/referrals", undefined, options?.search, options?.hash),
    },
    AnalyticsRoute: {
        to: "/analytics",
        build: (options) => interpolatePath("/analytics", undefined, options?.search, options?.hash),
    },
    AccountActivityRoute: {
        to: "/account/activity",
        build: (options) => interpolatePath("/account/activity", undefined, options?.search, options?.hash),
    },
    DiscoveryRoute: {
        to: "/discover",
        build: (options) => interpolatePath("/discover", undefined, options?.search, options?.hash),
    },
    ConsumerServicesRoute: {
        to: "/services",
        build: (options) => interpolatePath("/services", undefined, options?.search, options?.hash),
    },
    HowItWorksRoute: {
        to: "/how-it-works",
        build: (options) => interpolatePath("/how-it-works", undefined, options?.search, options?.hash),
    },
    ProviderDetailRoute: {
        to: "/pro/:providerId",
        build: (options) => interpolatePath("/pro/:providerId", options.params, options?.search, options?.hash),
    },
    ContactRoute: {
        to: "/contact",
        build: (options) => interpolatePath("/contact", undefined, options?.search, options?.hash),
    },
    RequestMessagesRoute: {
        to: "/my-requests/:requestId/messages",
        build: (options) => interpolatePath("/my-requests/:requestId/messages", options.params, options?.search, options?.hash),
    },
    AccountRequestMessagesRoute: {
        to: "/account/requests/:requestId/messages",
        build: (options) => interpolatePath("/account/requests/:requestId/messages", options.params, options?.search, options?.hash),
    },
    SubmitReviewRoute: {
        to: "/my-requests/:requestId/review",
        build: (options) => interpolatePath("/my-requests/:requestId/review", options.params, options?.search, options?.hash),
    },
    AccountRequestReviewRoute: {
        to: "/account/requests/:requestId/review",
        build: (options) => interpolatePath("/account/requests/:requestId/review", options.params, options?.search, options?.hash),
    },
    ServiceAreaRoute: {
        to: "/services/:serviceSlug/:areaSlug",
        build: (options) => interpolatePath("/services/:serviceSlug/:areaSlug", options.params, options?.search, options?.hash),
    },
    ProPublicRoute: {
        to: "/pro-public/:slug",
        build: (options) => interpolatePath("/pro-public/:slug", options.params, options?.search, options?.hash),
    },
    ProviderDashboardRoute: {
        to: "/provider/dashboard",
        build: (options) => interpolatePath("/provider/dashboard", undefined, options?.search, options?.hash),
    },
    ProviderLeadsRoute: {
        to: "/provider/leads",
        build: (options) => interpolatePath("/provider/leads", undefined, options?.search, options?.hash),
    },
    ProviderAppointmentsRoute: {
        to: "/provider/appointments",
        build: (options) => interpolatePath("/provider/appointments", undefined, options?.search, options?.hash),
    },
    ProviderProfileRoute: {
        to: "/provider/profile",
        build: (options) => interpolatePath("/provider/profile", undefined, options?.search, options?.hash),
    },
    ProviderBillingRoute: {
        to: "/provider/billing",
        build: (options) => interpolatePath("/provider/billing", undefined, options?.search, options?.hash),
    },
    ProviderServicesRoute: {
        to: "/provider/services",
        build: (options) => interpolatePath("/provider/services", undefined, options?.search, options?.hash),
    },
    ProviderRequestMessagesRoute: {
        to: "/provider/requests/:requestId/messages",
        build: (options) => interpolatePath("/provider/requests/:requestId/messages", options.params, options?.search, options?.hash),
    },
    AccountRoute: {
        to: "/account/profile",
        build: (options) => interpolatePath("/account/profile", undefined, options?.search, options?.hash),
    },
    AdminRoute: {
        to: "/admin",
        build: (options) => interpolatePath("/admin", undefined, options?.search, options?.hash),
    },
    AdminUsersRoute: {
        to: "/admin/users",
        build: (options) => interpolatePath("/admin/users", undefined, options?.search, options?.hash),
    },
    AdminRequestsRoute: {
        to: "/admin/requests",
        build: (options) => interpolatePath("/admin/requests", undefined, options?.search, options?.hash),
    },
    AdminProvidersRoute: {
        to: "/admin/providers",
        build: (options) => interpolatePath("/admin/providers", undefined, options?.search, options?.hash),
    },
    AdminRewardsRoute: {
        to: "/admin/rewards",
        build: (options) => interpolatePath("/admin/rewards", undefined, options?.search, options?.hash),
    },
    AdminReviewsRoute: {
        to: "/admin/reviews",
        build: (options) => interpolatePath("/admin/reviews", undefined, options?.search, options?.hash),
    },
    AdminCategoriesRoute: {
        to: "/admin/categories",
        build: (options) => interpolatePath("/admin/categories", undefined, options?.search, options?.hash),
    },
    AdminSettingsRoute: {
        to: "/admin/settings",
        build: (options) => interpolatePath("/admin/settings", undefined, options?.search, options?.hash),
    },
    AdminCalendarRoute: {
        to: "/admin/calendar",
        build: (options) => interpolatePath("/admin/calendar", undefined, options?.search, options?.hash),
    },
    AdminUIButtonsRoute: {
        to: "/admin/ui/buttons",
        build: (options) => interpolatePath("/admin/ui/buttons", undefined, options?.search, options?.hash),
    },
    NotFoundRoute: {
        to: "*",
        build: (options) => interpolatePath("*", options.params, options?.search, options?.hash),
    },
    AdminMessagesRoute: {
        to: "/admin/messages",
        build: (options) => interpolatePath("/admin/messages", undefined, options?.search, options?.hash),
    },
};
// PUBLIC API
export { Link } from './Link';
//# sourceMappingURL=index.js.map