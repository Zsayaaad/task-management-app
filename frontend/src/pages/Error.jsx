import { useRouteError, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Error = () => {
  const error = useRouteError();

  console.log(error);

  const queryClient = useQueryClient();

  // Check if current user data exists in React Query cache (dashboard uses ["user"], profile uses ["currentUser"])
  const userData =
    queryClient.getQueryData(["user"]) ||
    queryClient.getQueryData(["currentUser"]);
  const isAuthenticated = Boolean(userData?.user || userData);

  // Determine redirect link based on auth status
  const backDestination = isAuthenticated ? "/dashboard" : "/login";
  const backButtonText = isAuthenticated
    ? "Back to Dashboard"
    : "Back to Login";

  const is404 = error?.status === 404;

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-surface-container border border-border rounded-xl p-8 max-w-lg w-full text-center shadow-xl space-y-4">
        {/* Error Code / Icon */}
        <div className="w-16 h-16 rounded-full bg-surface-bright flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-4xl">
            {is404 ? "search_off" : "warning"}
          </span>
        </div>

        {/* Error Title */}
        <h1 className="font-page-title text-3xl font-bold text-on-surface">
          {is404 ? "404 - Page Not Found" : "Something Went Wrong"}
        </h1>

        {/* Error Message */}
        <p className="font-body text-sm text-text-muted max-w-md mx-auto">
          {is404
            ? "The page you are looking for does not exist or has been moved."
            : error?.data?.message ||
              error?.message ||
              "An unexpected error occurred. Please try again later."}
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to={backDestination}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">
              {isAuthenticated ? "dashboard" : "login"}
            </span>
            {backButtonText}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Error;
