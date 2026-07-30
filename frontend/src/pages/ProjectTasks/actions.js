import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const deleteTaskAction =
  (queryClient) =>
  async ({ params }) => {
    const { projectId, taskId } = params;

    try {
      const { data } = await customFetch.delete(
        `/tasks/${projectId}/${taskId}`,
      );

      toast.success(data?.message || "Task deleted successfully");

      // Invalidate project tasks and projects count cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Failed to delete task";
      toast.error(errorMsg);
      return { error: errorMsg };
    }
  };
