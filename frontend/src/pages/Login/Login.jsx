import { Form, Link, useNavigation } from "react-router-dom";

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-surface-container border border-border rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-page-title text-on-surface mb-2">Welcome Back</h1>
          <p className="font-body text-text-muted">
            Enter your credentials to sign in to your account
          </p>
        </div>

        {/* Form */}
        <Form method="post" className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-body text-sm font-medium text-on-surface"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="z@gmail.com"
              className="input-field font-body"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-body text-sm font-medium text-on-surface"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              className="input-field font-body"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-lg bg-primary hover:opacity-90 font-button text-on-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-on-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center font-body text-sm text-text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
