import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { singleProjectQuery } from "./loader";

const EditProject = () => {
  const { id } = useParams();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { data } = useQuery({
    ...singleProjectQuery(id),
    initialData: loaderData,
  });

  const project = data?.project || {};

  // If validation failed, retain user's edited input, otherwise use loaded DB data
  const defaultName = actionData?.fields?.name ?? project.name ?? "";
  const defaultDescription =
    actionData?.fields?.description ?? project.description ?? "";

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
          Edit Project
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg">
        {/* API Error Alert */}
        {actionData?.msg && (
          <div className="mb-4 p-3 bg-danger/15 border border-danger/30 rounded-lg text-danger text-sm">
            {actionData.msg}
          </div>
        )}

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
              key={`name-${defaultName}`}
              defaultValue={defaultName}
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors ${
                actionData?.errors?.name
                  ? "border-danger focus:border-danger"
                  : "border-border focus:border-primary"
              }`}
            />
            {actionData?.errors?.name && (
              <p className="mt-1 text-xs text-danger">
                {actionData.errors.name}
              </p>
            )}
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
              key={`desc-${defaultDescription}`}
              defaultValue={defaultDescription}
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors resize-none ${
                actionData?.errors?.description
                  ? "border-danger focus:border-danger"
                  : "border-border focus:border-primary"
              }`}
            />
            {actionData?.errors?.description && (
              <p className="mt-1 text-xs text-danger">
                {actionData.errors.description}
              </p>
            )}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditProject;
