import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const editTaskAction =
  (queryClient) =>
  async ({ request, params }) => {
    const { projectId, taskId } = params;
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Filter out empty fields if you only want to send filled data
    const payload = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== "" && value !== undefined) {
        payload[key] = value;
      }
    }

    try {
      const { data: responseData } = await customFetch.patch(
        `/tasks/${projectId}/${taskId}`,
        payload,
      );

      // Invalidate project tasks & projects list cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success(responseData?.message || "Task updated successfully");
      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      const errors = error?.response?.data?.errors;

      if (errors && typeof errors === "object") {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.msg || "Failed to update task");
      }

      return error;
    }
  };
