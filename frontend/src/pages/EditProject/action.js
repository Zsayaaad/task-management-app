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
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });

      toast.success("Project edited successfully");
      return redirect("/dashboard");
    } catch (error) {
      const errors = error?.response?.data?.errors;

      if (errors && typeof errors === "object") {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.msg || "Failed to update project");
      }

      return error;
    }
  };
