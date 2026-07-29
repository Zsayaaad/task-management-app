import customFetch from "../../utils/customFetch";

export const projectMembersQuery = (projectId) => ({
  queryKey: ["projectMembers", projectId],
  queryFn: async () => {
    const { data } = await customFetch.get(`/projects/${projectId}/members`);
    return data; // Returns [{ id, name, email, role }, ...] or { members: [...] }
  },
});

export const addTaskLoader =
  (queryClient) =>
  async ({ params }) => {
    const { projectId } = params;
    await queryClient.ensureQueryData(projectMembersQuery(projectId));
    return { projectId };
  };
