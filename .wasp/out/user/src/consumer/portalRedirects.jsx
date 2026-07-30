import { Navigate, useParams } from 'react-router';
export const DashboardRedirect = () => <Navigate to="/account" replace/>;
export const RequestServiceRedirect = () => <Navigate to="/account/request-service" replace/>;
export const MyRequestsRedirect = () => <Navigate to="/account/requests" replace/>;
export const RewardsRedirect = () => <Navigate to="/account/rewards" replace/>;
export const ReferralRedirect = () => <Navigate to="/account/referrals" replace/>;
export const AnalyticsRedirect = () => <Navigate to="/account/activity" replace/>;
export const AccountProfileRedirect = () => <Navigate to="/account/profile" replace/>;
export const RequestDetailRedirect = () => {
    const { requestId } = useParams();
    return <Navigate to={`/account/requests/${requestId}`} replace/>;
};
export const BookingRedirect = () => {
    const { requestId } = useParams();
    return <Navigate to={`/account/book/${requestId}`} replace/>;
};
