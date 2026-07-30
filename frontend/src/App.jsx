import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import {
  Register,
  Login,
  DashboardLayout,
  Projects,
  ProjectTasks,
  AddProject,
  AddTask,
  AddMember,
  ProjectMembers,
} from "./pages";

import { registerAction } from "./pages/Register/action";
import { loginAction } from "./pages/Login/actions";
import { dashboardLoader } from "./pages/Dashboard/loader";
import Loading from "./components/Loading";
import { projectsLoader } from "./pages/Projects/loader";
import { projectTasksLoader } from "./pages/ProjectTasks/loader";
import { addProjectAction } from "./pages/AddProject/action";
import EditProject from "./pages/EditProject/EditProject";
import { editProjectLoader } from "./pages/EditProject/loader";
import { editProjectAction } from "./pages/EditProject/action";
import { addTaskLoader } from "./pages/AddTask/loader";
import { addTaskAction } from "./pages/AddTask/action";
import { addMemberAction } from "./pages/AddMember/action";
import { projectMembersLoader } from "./pages/ProjectMembers/loader";
import { deleteMemberAction } from "./pages/ProjectMembers/action";
import { deleteProjectAction } from "./pages/DeleteProject/action";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction(queryClient),
  },
  {
    path: "dashboard",
    element: <DashboardLayout queryClient={queryClient} />,
    loader: dashboardLoader(queryClient),
    HydrateFallback: Loading,
    children: [
      {
        index: true,
        element: <Projects />,
        loader: projectsLoader(queryClient),
      },
      {
        path: "projects/:projectId/tasks",
        element: <ProjectTasks />,
        loader: projectTasksLoader(queryClient),
      },
      {
        path: "add-project",
        element: <AddProject />,
        action: addProjectAction(queryClient),
      },
      {
        path: "editProject/:id",
        element: <EditProject />,
        loader: editProjectLoader(queryClient),
        action: editProjectAction(queryClient),
      },
      {
        path: "projects/:projectId/add-task",
        element: <AddTask />,
        loader: addTaskLoader(queryClient),
        action: addTaskAction(queryClient),
      },
      {
        path: "projects/:projectId/add-member",
        element: <AddMember />,
        action: addMemberAction(queryClient),
      },
      {
        path: "projects/:projectId/members",
        element: <ProjectMembers />,
        loader: projectMembersLoader(queryClient),
      },
      {
        path: "projects/:projectId/members/:memberId/delete",
        action: deleteMemberAction(queryClient),
      },
      {
        path: "projects/:projectId/delete",
        action: deleteProjectAction(queryClient),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={3000} />
    </QueryClientProvider>
  );
}

export default App;
