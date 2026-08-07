import { useState } from "react";
import { Form, Link } from "react-router-dom";

const ProjectsContainer = ({ projects }) => {
  const [selectedProjectToDelete, setSelectedProjectToDelete] = useState(null);

  // Safety fallback
  if (!projects || !Array.isArray(projects)) {
    return null;
  }

  if (projects.length === 0) {
    return (
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
          There are no projects available matching your criteria.
        </p>
        <Link
          to="/dashboard/add-project"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline pt-2"
        >
          Create your first project
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* 2x2 Grid on desktop for larger, spacious cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-surface-container border border-border hover:border-primary/40 rounded-xl p-6 shadow-lg shadow-black/20 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Link
                  to={`/dashboard/projects/${project.id}/tasks`}
                  className="font-section-heading font-semibold text-xl text-on-surface hover:text-primary transition-colors line-clamp-1"
                >
                  {project.name}
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/dashboard/editProject/${project.id}`}
                    className="text-text-muted hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-bright"
                    title="Edit Project"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedProjectToDelete(project)}
                    className="text-text-muted hover:text-danger hover:bg-danger/10 p-1.5 rounded transition-colors"
                    title="Delete Project"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <p className="font-body text-sm text-text-muted line-clamp-3 mb-6 min-h-16">
                {project.description || "No description provided."}
              </p>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-medium min-w-0 flex-wrap">
                <Link
                  to={`/dashboard/projects/${project.id}/members`}
                  className="bg-surface-bright hover:bg-primary/10 hover:border-primary/50 text-on-surface px-3 py-1.5 rounded-lg border border-border/60 flex items-center gap-1.5 transition-all group/member whitespace-nowrap"
                  title="Manage Project Members"
                >
                  <span className="material-symbols-outlined text-base text-primary group-hover/member:scale-110 transition-transform">
                    group
                  </span>
                  <span>{project._count?.members ?? 0} Members</span>
                </Link>
                <Link
                  to={`/dashboard/projects/${project.id}/tasks`}
                  className="bg-surface-bright hover:bg-primary/10 hover:border-primary/50 text-on-surface px-3 py-1.5 rounded-lg border border-border/60 flex items-center gap-1.5 transition-all group/task whitespace-nowrap"
                  title="View Project Tasks"
                >
                  <span className="material-symbols-outlined text-base text-primary group-hover/task:scale-110 transition-transform">
                    task_alt
                  </span>
                  <span>{project._count?.tasks ?? 0} Tasks</span>
                </Link>
              </div>
              <Link
                to={`/dashboard/projects/${project.id}/tasks`}
                className="text-text-muted hover:text-primary transition-colors p-1.5 shrink-0"
                title="Open Project"
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedProjectToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-section-heading text-lg font-bold text-on-surface">
              Delete Project
            </h3>
            <p className="text-sm text-text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-on-surface font-semibold">
                "{selectedProjectToDelete.name}"
              </strong>
              ? This action cannot be undone and will delete all associated
              tasks.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => setSelectedProjectToDelete(null)}
                className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <Form
                method="post"
                action={`/dashboard/projects/${selectedProjectToDelete.id}/delete`}
                onSubmit={() => setSelectedProjectToDelete(null)}
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
    </>
  );
};

export default ProjectsContainer;
