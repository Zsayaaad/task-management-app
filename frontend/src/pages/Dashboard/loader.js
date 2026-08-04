import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await customFetch.get("/users/current-user");

    return data;
  },
};

export const dashboardLoader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    toast.error(error?.response?.data);
    return error;
    // redirect("/login");
  }
};
