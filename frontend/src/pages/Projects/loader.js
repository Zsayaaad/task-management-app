import customFetch from "../../utils/customFetch";

export const projectsQuery = (params) => {
  const { search, page, sort, limit } = params;

  return {
    queryKey: [
      "projects",
      search ?? "",
      page ?? 1,
      sort ?? "newest",
      limit ?? 4,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get("/projects", { params });

      return data;
    },
  };
};

export const projectsLoader =
  (queryClient) =>
  async ({ request }) => {
    const searchValues = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    return await queryClient.ensureQueryData(projectsQuery(searchValues));
  };
