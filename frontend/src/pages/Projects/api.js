import customFetch from "../../utils/customFetch";

export const fetchProjects = async () => {
  const { data } = await customFetch.get("/projects");
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await customFetch.post("/projects", projectData);
  return data;
};

export const updateProject = async ({ id, ...projectData }) => {
  const { data } = await customFetch.patch(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await customFetch.delete(`/projects/${id}`);
  return data;
};
