import { Form, Link, useNavigation } from "react-router-dom";

const AddProject = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          Add New Project
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg">
        <Form method="post" className="space-y-5" noValidate>
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
            >
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Delivery Application"
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors border-border focus:border-primary`}
            />
          </div>

          {/* Project Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Sample project created by seed script..."
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors resize-none border-border focus:border-primary`}
            />
          </div>

          {/* Form Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg font-button text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProject;
