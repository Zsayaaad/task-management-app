import { Form, Link, useNavigation } from "react-router-dom";

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-surface-container border border-border rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-page-title text-on-surface mb-2">
            Create new account
          </h1>
          <p className="font-body text-text-muted">
            Enter your data to register on the platform
          </p>
        </div>

        {/* Form */}
        <Form method="post" className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block font-body text-sm font-medium text-on-surface"
            >
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="fullName"
              required
              placeholder="Ziad"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-dim border border-border text-on-surface placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-body text-sm font-medium text-on-surface"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="z@z.com"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-dim border border-border text-on-surface placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
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
              className="w-full px-4 py-2.5 rounded-lg bg-surface-dim border border-border text-on-surface placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
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
                Registration in progress...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center font-body text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
