import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const editProjectAction =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.patch(`/projects/${params.id}`, data);

      // Invalidate project caches in React Query
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project edited successfully");
      return redirect("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
