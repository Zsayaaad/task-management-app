import { Form, Link, useActionData, useNavigation } from "react-router-dom";

const AddMember = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors mb-2"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Projects
        </Link>
        <h1 className="font-page-title text-2xl font-bold text-on-surface">
          Add Member to Project
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg">
        <Form method="post" className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
            >
              Member Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="member@example.com"
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors ${
                actionData?.errors?.email
                  ? "border-danger focus:border-danger"
                  : "border-border focus:border-primary"
              }`}
            />
            {actionData?.errors?.email && (
              <p className="mt-1 text-xs text-danger">
                {actionData.errors.email}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">
                person_add
              </span>
              {isSubmitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddMember;
