import customFetch from "../../utils/customFetch";

export const projectsQuery = {
  queryKey: ["projects"],
  queryFn: async () => {
    const { data } = await customFetch.get("/projects");
    return data; // returns { projects: [...] }
  },
};

export const projectsLoader = (queryClient) => async () => {
  return await queryClient.ensureQueryData(projectsQuery);
};
