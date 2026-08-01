import { Form, Link } from "react-router-dom";
import { FormRow, SubmitBtn } from "../../components";

const Register = () => {
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
          <FormRow
            name="fullName"
            type="text"
            labelText="Full name"
            placeholder="Ziad"
          />

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
          <SubmitBtn
            text="Create account"
            submittingText="Registration in progress..."
          />
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
