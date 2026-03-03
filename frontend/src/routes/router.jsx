import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import AlumniLayout from "../layouts/AlumniLayout";

import ErrorPage from "../pages/common/ErrorPage";
import RoleSelect from "../pages/common/RoleSelect";
import Page404 from "../pages/common/Page404";
import CreateJob from "../pages/common/CreateJob";
import CreateEvent from "../pages/common/CreateEvent";

/* Admin Pages */
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AlumniManagement from "../pages/admin/alumniManagement/AlumniManagement";
import SingleAlumniView from "../pages/admin/alumniManagement/SingleAlumniView";
import AdminJobs from "../pages/admin/jobs/AdminJobsPage";
import AdminEvents from "../pages/admin/events/AdminEventsPage";
import AdminBroadcast from "../pages/admin/broadcast/Broadcast";

/* Alumni Pages */
import AlumniDashboard from "../pages/alumni/dashboard/Dashboard";
import AlumniProfile from "../pages/alumni/profile/Profile";
import EditProfile from "../pages/alumni/profile/EditProfile";
import ChangePassword from "../pages/alumni/profile/ChangePassword";
import AlumniJobs from "../pages/alumni/jobs/Jobs";
import AlumniEvents from "../pages/alumni/events/Events";

import ProtectedRoute from "./protectedRoute";
import RoleRoute from "./roleRoutes";

const router = createBrowserRouter([
  // 🌐 Public / Auth routes

  {
    path: "/",
    element: <RoleSelect />,
  },
  {
    path: "/auth/:role",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
  },

    // 🛡️ Protected routes
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      // 👑 Admin routes
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "alumni", element: <AlumniManagement /> },
              { path: "alumni/:id", element: <SingleAlumniView /> },
              { path: "jobs", element: <AdminJobs /> },
              { path: "jobs/create", element: <CreateJob /> },
              { path: "events", element: <AdminEvents /> },
              { path: "events/create", element: <CreateEvent /> },
              { path: "broadcast", element: <AdminBroadcast /> },
            ],
          },
        ],
      },

      // 🎓 Alumni routes
      {
        element: <RoleRoute allowedRoles={["alumni"]} />,
        children: [
          {
            path: "/alumni",
            element: <AlumniLayout />,
            children: [
              { index: true, element: <AlumniDashboard /> },
              { path: "dashboard", element: <AlumniDashboard /> },
              { path: "profile", element: <AlumniProfile /> },
              { path: "profile/edit", element: <EditProfile /> },
              { path: "profile/change-password", element: <ChangePassword /> },
              { path: "jobs", element: <AlumniJobs /> },
              { path: "jobs/create", element: <CreateJob /> },
              { path: "events", element: <AlumniEvents /> },
              { path: "events/create", element: <CreateEvent /> },
            ],
          },
        ],
      },
    ],
  },

  // 🚫 Optional: Unauthorized page
  {
    path: "*",
    element: <Page404 />,
  },
]);

export default router;
