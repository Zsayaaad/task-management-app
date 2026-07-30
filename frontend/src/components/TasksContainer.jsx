import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { useProjectTasksContext } from "../context/ProjectTasksContext";

const TasksContainer = () => {
  const { data, projectId } = useProjectTasksContext();
  const tasks = data?.tasks || [];
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
      case "URGENT":
        return "bg-danger/15 text-danger border-danger/30";
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "LOW":
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "IN_PROGRESS":
        return "bg-primary/15 text-primary border-primary/30";
      case "TODO":
      default:
        return "bg-surface-bright text-text-muted border-border";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container border border-border rounded-xl p-12 text-center space-y-3 max-w-md mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-surface-bright flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-3xl">task</span>
        </div>
        <h3 className="font-section-heading text-lg font-semibold text-on-surface">
          No tasks found
        </h3>
        <p className="font-body text-sm text-text-muted">
          There are no tasks matching your selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-surface-container border border-border hover:border-primary/40 rounded-xl p-4 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {/* Task Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-section-heading font-semibold text-base text-on-surface">
                {task.title}
              </h3>
              <span
                className={`font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                  task.status,
                )}`}
              >
                {task.status?.replace("_", " ")}
              </span>
              <span
                className={`font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                  task.priority,
                )}`}
              >
                {task.priority}
              </span>
            </div>
            <p className="font-body text-xs text-text-muted line-clamp-2">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Assignee, Date & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/50 text-xs text-text-muted shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs">
                {task.assignee?.name
                  ? task.assignee.name[0].toUpperCase()
                  : "?"}
              </div>
              <div>
                <p className="font-medium text-on-surface text-xs">
                  {task.assignee?.name || "Unassigned"}
                </p>
                <p className="text-[10px] text-text-muted">Assignee</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-bright px-3 py-1.5 rounded-lg border border-border/60">
              <span className="material-symbols-outlined text-base text-primary">
                calendar_today
              </span>
              <span>{formatDate(task.dueDate)}</span>
            </div>

            {/* Action Buttons: Edit & Delete */}
            <div className="flex items-center gap-1">
              <Link
                to={`/dashboard/projects/${projectId}/tasks/${task.id}/edit`}
                className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-border/60 shrink-0"
                title="Edit Task"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedTaskToDelete(task)}
                className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors border border-border/60 shrink-0"
                title="Delete Task"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Task Confirmation Modal */}
      {selectedTaskToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-section-heading text-lg font-bold text-on-surface">
              Delete Task
            </h3>
            <p className="text-sm text-text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-on-surface font-semibold">
                "{selectedTaskToDelete.title}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => setSelectedTaskToDelete(null)}
                className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>

              <Form
                method="post"
                action={`/dashboard/projects/${projectId}/tasks/${selectedTaskToDelete.id}/delete`}
                onSubmit={() => setSelectedTaskToDelete(null)}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-danger text-white hover:bg-danger/90 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Execute_Delete
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksContainer;
