import customFetch from "../../utils/customFetch";

// Query for fetching project members
export const projectMembersQuery = (projectId) => ({
  queryKey: ["projectMembers", projectId],
  queryFn: async () => {
    const { data } = await customFetch.get(`/projects/${projectId}/members`);
    return data;
  },
});

// Query for fetching single task details
export const singleTaskQuery = (projectId, taskId) => ({
  queryKey: ["task", taskId],
  queryFn: async () => {
    const { data } = await customFetch.get(`/tasks/${projectId}/${taskId}`);
    return data;
  },
});

export const editTaskLoader =
  (queryClient) =>
  async ({ params }) => {
    const { projectId, taskId } = params;

    // Prefetch both task and project members in parallel
    await Promise.all([
      queryClient.ensureQueryData(singleTaskQuery(projectId, taskId)),
      queryClient.ensureQueryData(projectMembersQuery(projectId)),
    ]);

    return { projectId, taskId };
  };
