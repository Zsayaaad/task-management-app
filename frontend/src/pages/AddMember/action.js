import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const addMemberAction =
  (queryClient) =>
  async ({ request, params }) => {
    const { projectId } = params;
    const formData = await request.formData();
    const email = formData.get("email");

    try {
      const { data } = await customFetch.post(
        `/projects/${projectId}/members`,
        { email },
      );

      toast.success(data?.message || "Member added successfully!");

      // Refresh relevant caches
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });

      return redirect("/dashboard");
    } catch (error) {
      const errors = error?.response?.data?.errors;

      // console.log(error.response.data.msg);

      if (errors && typeof errors === "object") {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.msg || "Failed to add member");
      }

      return error;
    }
  };
