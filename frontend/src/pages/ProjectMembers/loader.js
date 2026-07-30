import customFetch from "../../utils/customFetch";

export const projectMembersQuery = (projectId) => ({
  queryKey: ["projectMembers", projectId],
  queryFn: async () => {
    const { data } = await customFetch.get(`/projects/${projectId}/members`);
    return data;
  },
});

export const projectMembersLoader =
  (queryClient) =>
  async ({ params }) => {
    const { projectId } = params;
    await queryClient.ensureQueryData(projectMembersQuery(projectId));
    return { projectId };
  };
