import { toast } from "react-toastify";
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
    try {
      const { projectId } = params;
      await queryClient.ensureQueryData(projectMembersQuery(projectId));
      return { projectId };
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
