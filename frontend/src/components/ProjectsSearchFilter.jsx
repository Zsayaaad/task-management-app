import { Form, useSearchParams, useSubmit } from "react-router-dom";

const ProjectsSearchFilter = () => {
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";

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
    <Form method="get" className="flex flex-col sm:flex-row gap-4 items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
          search
        </span>
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Search projects by name..."
          onChange={debounce((form) => submit(form))}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-lg text-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative w-full sm:w-56">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none">
          sort
        </span>
        <select
          name="sort"
          defaultValue={currentSort}
          onChange={(e) => e.target.form.requestSubmit()} // Auto-submits form when changed
          className="w-full pl-10 pr-8 py-2.5 bg-surface-container border border-border rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="a-z">Name (A-Z)</option>
          <option value="z-a">Name (Z-A)</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
          expand_more
        </span>
      </div>

      {/* IMPORTANT: Resets to page 1 when searching or sorting */}
      <input type="hidden" name="page" value="1" />
    </Form>
  );
};

export default ProjectsSearchFilter;
