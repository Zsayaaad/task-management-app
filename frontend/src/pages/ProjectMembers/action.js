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
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Failed to remove member";
      toast.error(errorMsg);
      return redirect(`/dashboard/projects/${projectId}/members`);
    }
  };
