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
      // queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      const errors = error?.response?.data?.errors;

      if (errors && typeof errors === "object") {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.msg || "Failed to delete task");
      }

      return error;
    }
  };
