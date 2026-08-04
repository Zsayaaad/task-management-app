import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { redirect } from "react-router-dom";

export const loginAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post("/auth/login", data);

      // Invalidate queries so React Query re-fetches user/dashboard data
      // If we don't pass anything in `invalidateQueries`, then we invalidate all of the queries
      queryClient.invalidateQueries();

      toast.success("Login successful");
      return redirect("/dashboard");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage);
      return error;
    }
  };
