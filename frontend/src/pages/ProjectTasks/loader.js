import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const projectTasksQuery = (projectId, params) => {
  const { priority, status, search, page } = params;

  return {
    queryKey: [
      "tasks",
      search ?? "",
      status ?? "all",
      priority ?? "all",
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get(`/tasks/${projectId}`, { params });

      return data;
    },
  };
};

export const projectTasksLoader =
  (queryClient) =>
  async ({ params, request }) => {
    try {
      const { projectId } = params;

      const searchValues = Object.fromEntries([
        ...new URL(request.url).searchParams.entries(),
      ]);

      await queryClient.ensureQueryData(
        projectTasksQuery(projectId, searchValues),
      );

      return { searchValues, projectId };
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
