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
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success(responseData?.message || "Task updated successfully");
      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Failed to update task";
      toast.error(errorMsg);
      return {
        msg: errorMsg,
        errors: error?.response?.data?.errors,
        fields: data,
      };
    }
  };
