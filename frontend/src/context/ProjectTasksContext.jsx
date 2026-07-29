import { createContext, useContext } from "react";

export const ProjectTasksContext = createContext();

export const useProjectTasksContext = () => useContext(ProjectTasksContext);
