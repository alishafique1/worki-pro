// @ts-nocheck
import { createAuthRequiredPage } from "wasp/client/app"

// These files are used from user-land and the import paths below are relative to the
// user's project dir, and not the SDK:
import LandingPage from './src/landing-page/LandingPage'
import RequestSuccessPage from './src/consumer/RequestSuccessPage'
import HvacLandingPage from './src/landing-page/HvacLandingPage'
import HandymanLandingPage from './src/landing-page/HandymanLandingPage'
import ApplianceLandingPage from './src/landing-page/ApplianceLandingPage'
import SmartHomeLandingPage from './src/landing-page/SmartHomeLandingPage'
import PlumbingLandingPage from './src/landing-page/PlumbingLandingPage'
import ElectricalLandingPage from './src/landing-page/ElectricalLandingPage'
import HowRewardsWorkPage from './src/landing-page/HowRewardsWorkPage'
import ServiceCategoryPage from './src/landing-page/services/ServiceCategoryPage'
import AreaLandingPage from './src/landing-page/AreaLandingPage'
import ProviderLandingPage from './src/provider/LandingPage'
import ProviderApplyPage from './src/provider/ApplyPage'
import ListYourServicesPage from './src/provider/ListYourServicesPage'
import TermsPage from './src/shared/TermsPage'
import PrivacyPage from './src/shared/PrivacyPage'
import OnboardingPage from './src/auth/onboarding/OnboardingPage'
import LoginPage from './src/auth/LoginPage'
import { Signup as SignupPage } from './src/auth/SignupPage'
import { RequestPasswordResetPage } from './src/auth/email-and-pass/RequestPasswordResetPage'
import { PasswordResetPage } from './src/auth/email-and-pass/PasswordResetPage'
import { EmailVerificationPage } from './src/auth/email-and-pass/EmailVerificationPage'
import RequestServicePage from './src/consumer/RequestServicePage'
import BookingPage from './src/consumer/BookingPage'
import DashboardPage from './src/consumer/DashboardPage'
import MyRequestsPage from './src/consumer/MyRequestsPage'
import RequestDetailPage from './src/consumer/RequestDetailPage'
import RewardsPage from './src/consumer/RewardsPage'
import HelpPage from './src/consumer/HelpPage'
import ReferralPage from './src/consumer/ReferralPage'
import AnalyticsPage from './src/consumer/AnalyticsPage'
import DiscoveryPage from './src/consumer/DiscoveryPage'
import ConsumerServicesPage from './src/consumer/ServicesPage'
import ListingsPage from './src/consumer/ListingsPage'
import HowItWorksPage from './src/consumer/HowItWorksPage'
import ProviderDetailPage from './src/consumer/ProviderDetailPage'
import ContactPage from './src/consumer/ContactPage'
import RequestMessagesPage from './src/consumer/RequestMessagesPage'
import SubmitReviewPage from './src/consumer/SubmitReviewPage'
import ServiceAreaLandingPage from './src/landing-page/ServiceAreaLandingPage'
import ProPublicPage from './src/consumer/ProPublicPage'
import ProviderDashboardPage from './src/provider/DashboardPage'
import ProviderLeadsPage from './src/provider/LeadsPage'
import ProviderAppointmentsPage from './src/provider/AppointmentsPage'
import ProviderProfilePage from './src/provider/ProfilePage'
import ProviderBillingPage from './src/provider/BillingPage'
import ProviderServicesPage from './src/provider/ServicesPage'
import ProviderRequestMessagesPage from './src/provider/RequestMessagesPage'
import AccountPage from './src/user/AccountPage'
import DemoAppPage from './src/demo-ai-app/DemoAppPage'
import FileUploadPage from './src/file-upload/FileUploadPage'
import AnalyticsDashboardPage from './src/admin/dashboards/analytics/AnalyticsDashboardPage'
import AdminUsersPage from './src/admin/dashboards/users/UsersDashboardPage'
import AdminRequestsPage from './src/admin/RequestsPage'
import AdminProvidersPage from './src/admin/ProvidersPage'
import AdminRewardsPage from './src/admin/RewardsPage'
import AdminReviewsPage from './src/admin/ReviewsPage'
import AdminSettingsPage from './src/admin/elements/settings/SettingsPage'
import AdminCalendarPage from './src/admin/elements/calendar/CalendarPage'
import AdminUIButtonsPage from './src/admin/elements/ui-elements/ButtonsPage'
import { NotFoundPage } from './src/client/components/NotFoundPage'
import AdminMessagesPage from './src/admin/dashboards/messages/MessagesPage'

export const routesMapping = {
  LandingPageRoute: LandingPage,
  RequestSuccessRoute: RequestSuccessPage,
  HvacRoute: HvacLandingPage,
  HandymanRoute: HandymanLandingPage,
  ApplianceRoute: ApplianceLandingPage,
  SmartHomeRoute: SmartHomeLandingPage,
  PlumbingRoute: PlumbingLandingPage,
  ElectricalRoute: ElectricalLandingPage,
  HowRewardsWorkRoute: HowRewardsWorkPage,
  ServiceCategoryRoute: ServiceCategoryPage,
  AreaRoute: AreaLandingPage,
  ProviderLandingRoute: ProviderLandingPage,
  ProviderApplyRoute: ProviderApplyPage,
  ListYourServicesRoute: ListYourServicesPage,
  TermsRoute: TermsPage,
  PrivacyRoute: PrivacyPage,
  OnboardingRoute: createAuthRequiredPage(OnboardingPage),
  LoginRoute: LoginPage,
  SignupRoute: SignupPage,
  RequestPasswordResetRoute: RequestPasswordResetPage,
  PasswordResetRoute: PasswordResetPage,
  EmailVerificationRoute: EmailVerificationPage,
  RequestServiceRoute: RequestServicePage,
  BookingRoute: createAuthRequiredPage(BookingPage),
  DashboardRoute: createAuthRequiredPage(DashboardPage),
  MyRequestsRoute: createAuthRequiredPage(MyRequestsPage),
  RequestDetailRoute: createAuthRequiredPage(RequestDetailPage),
  RewardsRoute: createAuthRequiredPage(RewardsPage),
  HelpRoute: HelpPage,
  ReferralRoute: createAuthRequiredPage(ReferralPage),
  AnalyticsRoute: createAuthRequiredPage(AnalyticsPage),
  DiscoveryRoute: DiscoveryPage,
  ConsumerServicesRoute: ConsumerServicesPage,
  ListingsRoute: ListingsPage,
  HowItWorksRoute: HowItWorksPage,
  ProviderDetailRoute: ProviderDetailPage,
  ContactRoute: ContactPage,
  RequestMessagesRoute: createAuthRequiredPage(RequestMessagesPage),
  SubmitReviewRoute: createAuthRequiredPage(SubmitReviewPage),
  ServiceAreaRoute: ServiceAreaLandingPage,
  ProPublicRoute: ProPublicPage,
  ProviderDashboardRoute: createAuthRequiredPage(ProviderDashboardPage),
  ProviderLeadsRoute: createAuthRequiredPage(ProviderLeadsPage),
  ProviderAppointmentsRoute: createAuthRequiredPage(ProviderAppointmentsPage),
  ProviderProfileRoute: createAuthRequiredPage(ProviderProfilePage),
  ProviderBillingRoute: createAuthRequiredPage(ProviderBillingPage),
  ProviderServicesRoute: createAuthRequiredPage(ProviderServicesPage),
  ProviderRequestMessagesRoute: createAuthRequiredPage(ProviderRequestMessagesPage),
  AccountRoute: createAuthRequiredPage(AccountPage),
  DemoAppRoute: createAuthRequiredPage(DemoAppPage),
  FileUploadRoute: createAuthRequiredPage(FileUploadPage),
  AdminRoute: createAuthRequiredPage(AnalyticsDashboardPage),
  AdminUsersRoute: createAuthRequiredPage(AdminUsersPage),
  AdminRequestsRoute: createAuthRequiredPage(AdminRequestsPage),
  AdminProvidersRoute: createAuthRequiredPage(AdminProvidersPage),
  AdminRewardsRoute: createAuthRequiredPage(AdminRewardsPage),
  AdminReviewsRoute: createAuthRequiredPage(AdminReviewsPage),
  AdminSettingsRoute: createAuthRequiredPage(AdminSettingsPage),
  AdminCalendarRoute: createAuthRequiredPage(AdminCalendarPage),
  AdminUIButtonsRoute: createAuthRequiredPage(AdminUIButtonsPage),
  NotFoundRoute: NotFoundPage,
  AdminMessagesRoute: createAuthRequiredPage(AdminMessagesPage),
} as const;
