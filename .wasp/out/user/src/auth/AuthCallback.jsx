import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "wasp/client/auth";
/**
 * Auth callback — reads user role and redirects to the appropriate dashboard.
 * Used as the onAuthSucceededRedirectTo target since Wasp requires a static path.
 */
export default function AuthCallback() {
    const { data: user, isLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoading)
            return;
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }
        const destination = user.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard";
        navigate(destination, { replace: true });
    }, [user, isLoading, navigate]);
    return (<div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-gray-500">Redirecting...</div>
    </div>);
}
