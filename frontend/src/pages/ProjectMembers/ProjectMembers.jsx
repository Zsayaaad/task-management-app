import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Form, Link, useParams } from "react-router-dom";
import { projectMembersQuery } from "./loader";

const ProjectMembers = () => {
  const { projectId } = useParams();
  // State to track member selected for removal modal
  const [selectedMember, setSelectedMember] = useState(null);

  const { members } = useQuery(projectMembersQuery(projectId)).data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
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
            Project Members
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Manage collaborators and team permissions for this project.
          </p>
        </div>

        <Link
          to={`/dashboard/projects/${projectId}/add-member`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Member
        </Link>
      </div>

      {/* Members List Table Container */}
      <div className="bg-surface-container border border-border rounded-xl shadow-lg overflow-hidden">
        {members.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">
            No members found for this project.
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {members.map((member) => {
              const userId = member.id;
              const name = member.name;
              const email = member.email;
              const role = member.role;

              return (
                <li
                  key={userId}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-surface-bright/50 transition-colors"
                >
                  {/* Left: Avatar & User Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {name}
                        </p>
                        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-bright text-text-muted border border-border uppercase">
                          {role}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted truncate">
                        {email}
                      </p>
                    </div>
                  </div>

                  {/* Right: Remove Button */}
                  {role !== "OWNER" && (
                    <button
                      type="button"
                      onClick={() => setSelectedMember({ id: userId, name })}
                      className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors shrink-0"
                      title="Remove Member"
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-section-heading text-lg font-bold text-on-surface">
              Remove Member
            </h3>
            <p className="text-sm text-text-muted">
              Are you sure you want to remove{" "}
              <strong className="text-on-surface font-semibold">
                {selectedMember.name}
              </strong>{" "}
              from this project?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 border border-border text-on-surface hover:bg-surface-bright rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>

              <Form
                method="post"
                action={`/dashboard/projects/${projectId}/members/${selectedMember.id}/delete`}
                onSubmit={() => setSelectedMember(null)}
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

export default ProjectMembers;
