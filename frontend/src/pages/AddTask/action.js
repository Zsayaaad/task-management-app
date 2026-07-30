import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const addTaskAction =
  (queryClient) =>
  async ({ request, params }) => {
    const { projectId } = params;
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post(`/tasks/${projectId}`, data);

      // Invalidate project tasks cache and projects list cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Task created successfully");
      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
