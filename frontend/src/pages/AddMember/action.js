import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const addMemberAction =
  (queryClient) =>
  async ({ request, params }) => {
    const { projectId } = params;
    const formData = await request.formData();
    const email = formData.get("email");

    // Basic Validation
    if (!email || !email.trim()) {
      toast.error("Email is required");
      return { errors: { email: "Email is required" } };
    }

    try {
      const { data } = await customFetch.post(
        `/projects/${projectId}/members`,
        { email: email.trim() },
      );

      toast.success(data?.message || "Member added successfully!");

      // Refresh relevant caches
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });

      return redirect("/dashboard");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors?.email[0] ||
        error?.response?.data?.message ||
        "Failed to add member";

      toast.error(errorMsg);
      return error;
    }
  };
