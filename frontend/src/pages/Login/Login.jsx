import { Form, Link } from "react-router-dom";
import { FormRow, SubmitBtn } from "../../components";

const Login = () => {
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
          <FormRow
            name={"email"}
            type={"email"}
            labelText={"Email Address"}
            placeholder={"z@gmail.com"}
          />

          {/* Password Field */}
          <FormRow
            name={"password"}
            type={"password"}
            labelText={"Password"}
            placeholder={"••••••••"}
          />

          {/* Submit Button */}
          <SubmitBtn text="Sign In" submittingText="Logging in..." />
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
