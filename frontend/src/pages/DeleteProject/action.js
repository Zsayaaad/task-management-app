import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const deleteProjectAction =
  (queryClient) =>
  async ({ params }) => {
    const { projectId } = params;

    try {
      const { data } = await customFetch.delete(`/projects/${projectId}`);
      toast.success(data?.message || "Project deleted successfully");

      // Invalidate project list cache
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      return redirect("/dashboard");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Failed to delete project";
      toast.error(errorMsg);
      return redirect(`/dashboard`);
    }
  };
