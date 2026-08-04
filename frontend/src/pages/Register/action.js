import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { redirect } from "react-router-dom";

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login");
  } catch (error) {
    const errors = error?.response?.data?.errors;

    if (errors && typeof errors === "object") {
      Object.values(errors)
        .flat()
        .forEach((msg) => toast.error(msg));
    } else {
      toast.error(error?.response?.data?.msg || "Register failed");
    }

    return error;
  }
};
