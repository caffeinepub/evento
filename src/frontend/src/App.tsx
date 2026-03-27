import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AddEventPage } from "./pages/AddEventPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EventInvitePage } from "./pages/EventInvitePage";
import { EventListPage } from "./pages/EventListPage";
import { EventPeoplePage } from "./pages/EventPeoplePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RSVPPage } from "./pages/RSVPPage";
import { RegisterPage } from "./pages/RegisterPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const addEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-event",
  component: () => (
    <ProtectedRoute>
      <AddEventPage />
    </ProtectedRoute>
  ),
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: () => (
    <ProtectedRoute>
      <EventListPage />
    </ProtectedRoute>
  ),
});

const eventPeopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/people",
  component: () => (
    <ProtectedRoute>
      <EventPeoplePage />
    </ProtectedRoute>
  ),
});

const eventInviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/invite",
  component: () => (
    <ProtectedRoute>
      <EventInvitePage />
    </ProtectedRoute>
  ),
});

const rsvpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rsvp",
  component: RSVPPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  loginRoute,
  dashboardRoute,
  addEventRoute,
  eventsRoute,
  eventPeopleRoute,
  eventInviteRoute,
  rsvpRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
