import { Form, Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectMembersQuery, singleTaskQuery } from "./loader";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import { FormRow, SubmitBtn } from "../../components";

const EditTask = () => {
  const { projectId, taskId } = useParams();

  const { task } = useQuery(singleTaskQuery(projectId, taskId)).data;

  const { members } = useQuery(projectMembersQuery(projectId)).data;

  // Format YYYY-MM-DD from ISO string for <input type="date" />
  const formattedDueDate = task?.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";

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
          Edit Task
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg">
        <Form method="post" className="space-y-5" noValidate>
          {/* Task Title */}
          <FormRow
            labelText={"Task Title"}
            name={"title"}
            type={"text"}
            placeholder={"e.g. Build Task Module"}
          />

          {/* Task Description */}
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
              rows={3}
              placeholder="Describe the task requirements..."
              defaultValue={task.description}
              className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors resize-none border-border focus:border-primary1 `}
            />
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
                defaultValue={task.status ?? TASK_STATUS.TODO}
                className="w-full px-3.5 py-2.5 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {Object.values(TASK_STATUS).map((itemValue) => (
                  <option key={itemValue} value={itemValue}>
                    {itemValue}
                  </option>
                ))}
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
                defaultValue={task.priority ?? TASK_PRIORITY.MEDIUM}
                className="w-full px-3.5 py-2.5 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {Object.values(TASK_PRIORITY).map((itemValue) => (
                  <option key={itemValue} value={itemValue}>
                    {itemValue}
                  </option>
                ))}
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
                Assignee
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                defaultValue={task?.assigneeId ?? ""}
                className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors border-border focus:border-primary`}
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
            </div>

            {/* Due Date Picker */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={formattedDueDate}
                className={`w-full px-3.5 py-2.5 bg-surface-dim border rounded-lg text-on-surface text-sm focus:outline-none transition-colors border-border focus:border-primary`}
              />
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

            <SubmitBtn
              text={"Update Task"}
              className={
                "px-5 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
              }
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditTask;
