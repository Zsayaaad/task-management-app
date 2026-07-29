import { useLoaderData, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectTasksQuery } from "./queries";
import { ProjectTasksContext } from "../../context/ProjectTasksContext";
import SearchFilterContainer from "../../components/SearchFilterContainer";
import TasksContainer from "../../components/TasksContainer";
import PaginationBtnContainer from "../../components/PaginationBtnContainer";

const ProjectTasks = () => {
  const { searchValues, projectId } = useLoaderData();
  const { data } = useQuery(projectTasksQuery(projectId, searchValues));

  const totalTasks = data?.pagination?.totalTasks || 0;
  const numOfPages = data?.pagination?.numOfPages || 1;

  return (
    <ProjectTasksContext.Provider value={{ data, searchValues, projectId }}>
      <main className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="pb-4 border-b border-border mb-6">
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
            Project Tasks
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Manage, filter, and track active project tasks.
          </p>
        </header>

        {/* Search & Filters */}
        <SearchFilterContainer />

        {/* Total Tasks Title */}
        <h2 className="font-section-heading text-lg font-semibold text-on-surface mb-4">
          {totalTasks} task{totalTasks !== 1 && "s"} found
        </h2>

        {/* Tasks List */}
        <TasksContainer />

        {/* Pagination */}
        {numOfPages > 1 && <PaginationBtnContainer />}
      </main>
    </ProjectTasksContext.Provider>
  );
};

export default ProjectTasks;
