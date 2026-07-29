import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const addTaskAction =
  (queryClient) =>
  async ({ request, params }) => {
    const { projectId } = params;
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const errors = {};

    // Title Validation
    if (!data.title || !data.title.trim()) {
      errors.title = "Title is required";
    } else if (data.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (data.title.trim().length > 150) {
      errors.title = "Title must be at most 150 characters";
    }

    // Description Validation (Required by Zod Schema)
    if (!data.description || !data.description.trim()) {
      errors.description = "Description is required";
    } else if (data.description.trim().length > 1000) {
      errors.description = "Description must be at most 1000 characters";
    }

    // Assignee Validation
    if (!data.assigneeId) {
      errors.assigneeId = "Assignee is required";
    }

    // Due Date Validation
    if (!data.dueDate) {
      errors.dueDate = "Due date is required";
    }

    // If validation fails, return errors to form
    if (Object.keys(errors).length > 0) {
      return { errors, fields: data };
    }

    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        status: data.status || "TODO",
        priority: data.priority || "MEDIUM",
      };

      await customFetch.post(`/tasks/${projectId}`, payload);

      // Invalidate project tasks cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast.success("Task created successfully");
      return redirect(`/dashboard/projects/${projectId}/tasks`);
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
