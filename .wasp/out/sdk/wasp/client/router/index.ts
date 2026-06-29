import { interpolatePath } from './linkHelpers'
import type {
  RouteDefinitionsToRoutes,
  OptionalRouteOptions,
  ParamValue,
  ExpandRouteOnOptionalStaticSegments,
} from './types'

// PUBLIC API
export const routes = {
  LandingPageRoute: {
    to: "/",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  RequestSuccessRoute: {
    to: "/request-success",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/request-success",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  HvacRoute: {
    to: "/hvac",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/hvac",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  HandymanRoute: {
    to: "/handyman",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/handyman",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ApplianceRoute: {
    to: "/appliance-repair",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/appliance-repair",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  SmartHomeRoute: {
    to: "/smart-home",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/smart-home",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  PlumbingRoute: {
    to: "/plumbing",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/plumbing",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ElectricalRoute: {
    to: "/electrical",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/electrical",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  HowRewardsWorkRoute: {
    to: "/how-rewards-work",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/how-rewards-work",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AreaRoute: {
    to: "/areas/:areaSlug",
    build: (
      options: OptionalRouteOptions
      & { params: {"areaSlug": ParamValue;}}
    ) => interpolatePath(
        
        "/areas/:areaSlug",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ProviderLandingRoute: {
    to: "/providers",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/providers",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderApplyRoute: {
    to: "/providers/apply",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/providers/apply",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  TermsRoute: {
    to: "/terms",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/terms",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  PrivacyRoute: {
    to: "/privacy",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/privacy",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  OnboardingRoute: {
    to: "/onboarding",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/onboarding",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  LoginRoute: {
    to: "/login",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/login",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  SignupRoute: {
    to: "/signup",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/signup",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  RequestPasswordResetRoute: {
    to: "/request-password-reset",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/request-password-reset",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  PasswordResetRoute: {
    to: "/password-reset",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/password-reset",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  EmailVerificationRoute: {
    to: "/email-verification",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/email-verification",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  RequestServiceRoute: {
    to: "/request-service",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/request-service",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountRequestServiceRoute: {
    to: "/account/request-service",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/request-service",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  GuestRequestWizardRoute: {
    to: "/get-quotes",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/get-quotes",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  CategoryLandingRoute: {
    to: "/services/:categorySlug",
    build: (
      options: OptionalRouteOptions
      & { params: {"categorySlug": ParamValue;}}
    ) => interpolatePath(
        
        "/services/:categorySlug",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  BookingRoute: {
    to: "/book/:requestId",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/book/:requestId",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AccountBookRoute: {
    to: "/account/book/:requestId",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/account/book/:requestId",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  DashboardRoute: {
    to: "/dashboard",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/dashboard",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountHomeRoute: {
    to: "/account",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  MyRequestsRoute: {
    to: "/my-requests",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/my-requests",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountRequestsRoute: {
    to: "/account/requests",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/requests",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  RequestDetailRoute: {
    to: "/my-requests/:requestId",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/my-requests/:requestId",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AccountRequestDetailRoute: {
    to: "/account/requests/:requestId",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/account/requests/:requestId",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  RewardsRoute: {
    to: "/rewards",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/rewards",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountRewardsRoute: {
    to: "/account/rewards",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/rewards",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  HelpRoute: {
    to: "/help",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/help",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ReferralRoute: {
    to: "/referral",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/referral",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountReferralsRoute: {
    to: "/account/referrals",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/referrals",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AnalyticsRoute: {
    to: "/analytics",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/analytics",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AccountActivityRoute: {
    to: "/account/activity",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/activity",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  DiscoveryRoute: {
    to: "/discover",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/discover",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ConsumerServicesRoute: {
    to: "/services",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/services",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  HowItWorksRoute: {
    to: "/how-it-works",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/how-it-works",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderDetailRoute: {
    to: "/pro/:providerId",
    build: (
      options: OptionalRouteOptions
      & { params: {"providerId": ParamValue;}}
    ) => interpolatePath(
        
        "/pro/:providerId",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ContactRoute: {
    to: "/contact",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/contact",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  RequestMessagesRoute: {
    to: "/my-requests/:requestId/messages",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/my-requests/:requestId/messages",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AccountRequestMessagesRoute: {
    to: "/account/requests/:requestId/messages",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/account/requests/:requestId/messages",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  SubmitReviewRoute: {
    to: "/my-requests/:requestId/review",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/my-requests/:requestId/review",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AccountRequestReviewRoute: {
    to: "/account/requests/:requestId/review",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/account/requests/:requestId/review",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ServiceAreaRoute: {
    to: "/services/:serviceSlug/:areaSlug",
    build: (
      options: OptionalRouteOptions
      & { params: {"serviceSlug": ParamValue;"areaSlug": ParamValue;}}
    ) => interpolatePath(
        
        "/services/:serviceSlug/:areaSlug",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ProPublicRoute: {
    to: "/pro-public/:slug",
    build: (
      options: OptionalRouteOptions
      & { params: {"slug": ParamValue;}}
    ) => interpolatePath(
        
        "/pro-public/:slug",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ProsRoute: {
    to: "/pros/:slug",
    build: (
      options: OptionalRouteOptions
      & { params: {"slug": ParamValue;}}
    ) => interpolatePath(
        
        "/pros/:slug",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  ProviderDashboardRoute: {
    to: "/provider/dashboard",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/dashboard",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderLeadsRoute: {
    to: "/provider/leads",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/leads",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderAppointmentsRoute: {
    to: "/provider/appointments",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/appointments",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderProfileRoute: {
    to: "/provider/profile",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/profile",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderBillingRoute: {
    to: "/provider/billing",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/billing",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderServicesRoute: {
    to: "/provider/services",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/provider/services",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ProviderRequestMessagesRoute: {
    to: "/provider/requests/:requestId/messages",
    build: (
      options: OptionalRouteOptions
      & { params: {"requestId": ParamValue;}}
    ) => interpolatePath(
        
        "/provider/requests/:requestId/messages",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AccountRoute: {
    to: "/account/profile",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/account/profile",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminRoute: {
    to: "/admin",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminUsersRoute: {
    to: "/admin/users",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/users",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminRequestsRoute: {
    to: "/admin/requests",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/requests",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminProvidersRoute: {
    to: "/admin/providers",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/providers",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminRewardsRoute: {
    to: "/admin/rewards",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/rewards",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminReviewsRoute: {
    to: "/admin/reviews",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/reviews",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminCategoriesRoute: {
    to: "/admin/categories",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/categories",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminSettingsRoute: {
    to: "/admin/settings",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/settings",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminCalendarRoute: {
    to: "/admin/calendar",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/calendar",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminUIButtonsRoute: {
    to: "/admin/ui/buttons",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/ui/buttons",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  NotFoundRoute: {
    to: "*",
    build: (
      options: OptionalRouteOptions
      & { params: {"*": ParamValue;}}
    ) => interpolatePath(
        
        "*",
        options.params,
        options?.search,
        options?.hash
      ),
  },
  AdminMessagesRoute: {
    to: "/admin/messages",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/messages",
        undefined,
        options?.search,
        options?.hash
      ),
  },
} as const;

// PRIVATE API
export type Routes = RouteDefinitionsToRoutes<typeof routes>

// PUBLIC API
export { Link } from './Link'
