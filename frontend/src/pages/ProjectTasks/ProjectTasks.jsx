import { useLoaderData, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProjectTasksContext } from "../../context/ProjectTasksContext";
import SearchFilterContainer from "../../components/SearchFilterContainer";
import TasksContainer from "../../components/TasksContainer";
import PaginationBtnContainer from "../../components/PaginationBtnContainer";
import { projectTasksQuery } from "./loader";

const ProjectTasks = () => {
  const { searchValues, projectId } = useLoaderData();
  const { data } = useQuery(projectTasksQuery(projectId, searchValues));

  const project = data?.project;
  const totalTasks = data?.pagination?.totalTasks || 0;
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 };

  return (
    <ProjectTasksContext.Provider value={{ data, searchValues, projectId }}>
      <main className="max-w-7xl mx-auto">
        {/* Header Navigation & Add Task Button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border mb-6">
          <div className="flex-1 min-w-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors mb-3"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Back to Projects
            </Link>

            {/* Dynamic Project Name */}
            <h1 className="font-page-title text-2xl font-bold text-on-surface">
              {project?.name || "Project Tasks"}
            </h1>

            {/* Dynamic Full Description or Fallback */}
            {project?.description ? (
              <p className="font-body text-sm text-text-muted mt-2 max-w-2xl whitespace-pre-line">
                {project.description}
              </p>
            ) : (
              <p className="font-body text-sm text-text-muted mt-1">
                Manage, filter, and track active project tasks.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
            {/* PHASE 5/6: Start Meeting Button */}
            <Link
              to={`/dashboard/projects/${projectId}/meeting`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">
                videocam
              </span>
              Start Meeting
            </Link>

            {/* Existing Add Task Button */}
            <Link
              to={`/dashboard/projects/${projectId}/add-task`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Task
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilterContainer />

        {/* Total Tasks Title */}
        <h2 className="font-section-heading text-lg font-semibold text-on-surface mb-4 mt-6">
          {totalTasks} task{totalTasks !== 1 && "s"} found
        </h2>

        {/* Tasks List */}
        <TasksContainer />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <PaginationBtnContainer pagination={pagination} />
        )}
      </main>
    </ProjectTasksContext.Provider>
  );
};

export default ProjectTasks;
