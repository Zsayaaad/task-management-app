import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectMembersQuery } from "./loader";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";

const AddTask = () => {
  const { projectId } = useParams();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { data: membersData } = useQuery({
    ...projectMembersQuery(projectId),
    initialData: loaderData,
  });

  const members = Array.isArray(membersData)
    ? membersData
    : membersData?.members || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <Link
          to={`/dashboard/projects/${projectId}/tasks`}
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors mb-2"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Tasks
        </Link>
        <h1 className="font-page-title text-2xl font-bold text-on-surface">
          Create New Task
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
          {/* Task Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
            >
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Build Task Module"
              defaultValue={actionData?.fields?.title || ""}
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors ${
                actionData?.errors?.title
                  ? "border-danger focus:border-danger"
                  : "border-border focus:border-primary"
              }`}
            />
            {actionData?.errors?.title && (
              <p className="mt-1 text-xs text-danger">
                {actionData.errors.title}
              </p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
            >
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe the task requirements..."
              defaultValue={actionData?.fields?.description || ""}
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

          {/* Grid Row 1: Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Select */}
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={actionData?.fields?.status || TASK_STATUS.TODO}
                className="w-full px-3.5 py-2.5 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {Object.values(TASK_STATUS).map((itemValue) => {
                  return (
                    <option key={itemValue} value={itemValue}>
                      {itemValue}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label
                htmlFor="priority"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={actionData?.fields?.priority || TASK_PRIORITY.MEDIUM}
                className="w-full px-3.5 py-2.5 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {Object.values(TASK_PRIORITY).map((itemValue) => {
                  return (
                    <option key={itemValue} value={itemValue}>
                      {itemValue}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Grid Row 2: Assignee & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee Select */}
            <div>
              <label
                htmlFor="assigneeId"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
              >
                Assignee <span className="text-danger">*</span>
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                defaultValue={actionData?.fields?.assigneeId || ""}
                className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors ${
                  actionData?.errors?.assigneeId
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-primary"
                }`}
              >
                <option value="">Select a member</option>
                {members.map((member) => {
                  const id = member.id || member.userId;
                  const name = member.name || member.user?.name || member.email;
                  return (
                    <option key={id} value={id}>
                      {name} {member.role ? `(${member.role})` : ""}
                    </option>
                  );
                })}
              </select>
              {actionData?.errors?.assigneeId && (
                <p className="mt-1 text-xs text-danger">
                  {actionData.errors.assigneeId}
                </p>
              )}
            </div>

            {/* Due Date Picker */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
              >
                Due Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={actionData?.fields?.dueDate || ""}
                className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors ${
                  actionData?.errors?.dueDate
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-primary"
                }`}
              />
              {actionData?.errors?.dueDate && (
                <p className="mt-1 text-xs text-danger">
                  {actionData.errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Link
              to={`/dashboard/projects/${projectId}/tasks`}
              className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg font-button text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddTask;
