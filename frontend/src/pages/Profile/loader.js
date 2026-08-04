import customFetch from "../../utils/customFetch";

export const currentUserQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await customFetch.get("/users/current-user");
    return data; // Returns { user: { id, name, email, role, createdAt, updatedAt } }
  },
};

export const profileLoader = (queryClient) => async () => {
  await queryClient.ensureQueryData(currentUserQuery);
  return null;
};
