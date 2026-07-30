/**
 * Auth callback — reads user role and redirects to the appropriate dashboard.
 * Used as the onAuthSucceededRedirectTo target since Wasp requires a static path.
 */
export default function AuthCallback(): import("react").JSX.Element;
