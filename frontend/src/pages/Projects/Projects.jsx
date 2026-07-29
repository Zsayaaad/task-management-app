import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { projectsQuery } from "./loader";

const Projects = () => {
  const loaderData = useLoaderData();

  // Sync React Query cache with loader data
  const { data } = useQuery({
    ...projectsQuery,
    initialData: loaderData,
  });

  const projects = data?.projects || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-page-title text-2xl font-bold text-on-surface">
          Projects
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Select a project workspace to view tasks and collaborators
        </p>
      </div>

      {/* Projects Grid / Empty State */}
      {projects.length === 0 ? (
        <div className="bg-surface-container border border-border rounded-xl p-12 text-center space-y-3 max-w-md mx-auto my-12">
          <div className="w-14 h-14 rounded-full bg-surface-bright flex items-center justify-center mx-auto text-primary">
            <span className="material-symbols-outlined text-3xl">
              folder_open
            </span>
          </div>
          <h3 className="font-section-heading text-lg font-semibold text-on-surface">
            No projects found
          </h3>
          <p className="font-body text-sm text-text-muted">
            There are no projects available in the database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-surface-container border border-border hover:border-primary/40 rounded-xl p-5 shadow-lg shadow-black/20 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/dashboard/projects/${project.id}/tasks`}
                  // className="font-section-heading font-semibold text-lg text-on-surface hover:text-primary transition-colors line-clamp-1"
                >
                  {/* Project Title */}
                  <h2 className="mb-2">{project.name}</h2>

                  {/* Description */}
                  <p className="font-body text-sm text-text-muted line-clamp-2 mb-6 min-h-10">
                    {project.description || "No description provided."}
                  </p>
                </Link>
              </div>

              {/* Card Footer Stats */}
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                  <span className="bg-surface-bright px-2.5 py-1 rounded-md border border-border/60 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">
                      group
                    </span>
                    {project._count?.members ?? 0} Members
                  </span>
                  <span className="bg-surface-bright px-2.5 py-1 rounded-md border border-border/60 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">
                      task_alt
                    </span>
                    {project._count?.tasks ?? 0} Tasks
                  </span>
                </div>

                <Link
                  to={`/dashboard/projects/${project.id}/tasks`}
                  className="text-text-muted hover:text-primary transition-colors p-1 flex items-center justify-center"
                  title="View Project Tasks"
                >
                  <span className="material-symbols-outlined text-xl">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
