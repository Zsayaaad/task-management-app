import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { redirect } from "react-router-dom";

export const singleProjectQuery = (id) => ({
  queryKey: ["project", id],
  queryFn: async () => {
    const { data } = await customFetch.get(`/projects/${id}`);
    return data; // Returns { project: { id, name, description, ... } }
  },
});

export const editProjectLoader =
  (queryClient) =>
  async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(singleProjectQuery(params.id));
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return redirect("/dashboard");
    }
  };
