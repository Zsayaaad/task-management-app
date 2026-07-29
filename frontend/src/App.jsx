import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import {
  Register,
  Login,
  DashboardLayout,
  Projects,
  ProjectTasks,
} from "./pages";

import { registerAction } from "./pages/Register/action";
import { loginAction } from "./pages/Login/actions";
import { dashboardLoader } from "./pages/Dashboard/loader";
import Loading from "./components/Loading";
import { projectsLoader } from "./pages/Projects/loader";
import { projectTasksLoader } from "./pages/ProjectTasks/loader";

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
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
