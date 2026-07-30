import { Form, Link, useSubmit } from "react-router-dom";
import { useProjectTasksContext } from "../context/ProjectTasksContext";
import { TASK_STATUS, TASK_PRIORITY } from "../utils/constants";


const SearchFilterContainer = () => {
  const { searchValues, projectId } = useProjectTasksContext();
  const { priority, status, assigneeName } = searchValues;
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 500);
    };
  };

  return (
    <section className="bg-surface-container border border-border rounded-xl p-4 mb-6">
      <Form>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Assignee Search */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Assignee Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
                search
              </span>
              <input
                type="search"
                name="assigneeName"
                placeholder="Search assignee..."
                defaultValue={assigneeName}
                onChange={debounce((form) => submit(form))}
                className="w-full pl-9 pr-3 py-2 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Priority Select */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              name="priority"
              defaultValue={priority || "all"}
              onChange={(e) => submit(e.currentTarget.form)}
              className="w-full px-3 py-2 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Priorities</option>
              {Object.values(TASK_PRIORITY).map((itemValue) => (
                <option key={itemValue} value={itemValue}>
                  {itemValue}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              name="status"
              defaultValue={status || "all"}
              onChange={(e) => submit(e.currentTarget.form)}
              className="w-full px-3 py-2 bg-surface-dim border border-border rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Statuses</option>
              {Object.values(TASK_STATUS).map((itemValue) => (
                <option key={itemValue} value={itemValue}>
                  {itemValue}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Link */}
          <Link
            to={`/dashboard/projects/${projectId}/tasks`}
            className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg font-button text-sm transition-colors text-center flex items-center justify-center gap-1.5 h-10"
          >
            <span className="material-symbols-outlined text-base">
              restart_alt
            </span>
            Reset Filters
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default SearchFilterContainer;
