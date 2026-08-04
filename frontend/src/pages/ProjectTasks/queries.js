import customFetch from "../../utils/customFetch";

export const projectTasksQuery = (projectId, params) => {
  const { priority, status, assigneeName, page } = params;

  // const cleanParams = {};
  // if (priority && priority !== "all") cleanParams.priority = priority;
  // if (status && status !== "all") cleanParams.status = status;
  // if (assigneeName && assigneeName.trim() !== "")
  //   cleanParams.assigneeName = assigneeName.trim();
  // if (page) cleanParams.page = page;

  return {
    queryKey: [
      "tasks",
      assigneeName ?? "",
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
