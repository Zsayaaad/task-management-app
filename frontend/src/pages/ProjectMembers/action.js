import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const deleteMemberAction =
  (queryClient) =>
  async ({ params }) => {
    const { projectId, memberId } = params;

    try {
      const { data } = await customFetch.delete(
        `/projects/${projectId}/members/${memberId}`,
      );

      toast.success(data?.message || "Member removed successfully");

      // Invalidate queries to update cache UI
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      return redirect(`/dashboard/projects/${projectId}/members`);
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        Object.values(errors).flat.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response.data.msg || "Failed to delete member");
      }
      return redirect(`/dashboard/projects/${projectId}/members`);
    }
  };
