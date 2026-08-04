import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const addProjectAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post("/projects", data);

      // Invalidate project list cache in React Query
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added Successfully");
      return redirect("/dashboard");
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors && typeof errors === "object") {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response.data.msg || "Failed to add project");
      }

      return error;
    }
  };
