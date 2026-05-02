import { useState } from "react";
import { useNavigate } from "react-router";
import { signup, useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";

export function Signup() {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONSUMER" | "PROVIDER">("CONSUMER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Already logged in — redirect immediately
  if (user) {
    const redirectTo = user.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard";
    navigate(redirectTo, { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signup({
        email,
        password,
        additionalData: { role },
      });
      // Navigate immediately — post-auth redirect is handled in App.tsx
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-1 text-sm text-gray-600">
          Join Worki as a homeowner or service professional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-900 mb-2">I am a...</legend>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                role === "CONSUMER"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="CONSUMER"
                checked={role === "CONSUMER"}
                onChange={() => setRole("CONSUMER")}
                className="sr-only"
              />
              <div className="text-lg font-semibold">Homeowner</div>
              <div className="text-xs mt-0.5">Find trusted pros</div>
            </label>
            <label
              className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                role === "PROVIDER"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="PROVIDER"
                checked={role === "PROVIDER"}
                onChange={() => setRole("PROVIDER")}
                className="sr-only"
              />
              <div className="text-lg font-semibold">Service Pro</div>
              <div className="text-xs mt-0.5">Grow your business</div>
            </label>
          </div>
        </fieldset>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="Min. 8 characters"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <WaspRouterLink to={routes.LoginRoute.to} className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </WaspRouterLink>
      </div>
    </AuthPageLayout>
  );
}
