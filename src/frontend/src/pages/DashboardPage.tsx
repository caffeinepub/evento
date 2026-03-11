import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  List,
  LogOut,
  Plus,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { AppHeader } from "../components/AppHeader";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllEvents, useGetCallerUserProfile } from "../hooks/useQueries";

export function DashboardPage() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const profileQuery = useGetCallerUserProfile();
  const eventsQuery = useGetAllEvents();

  const userName = profileQuery.data?.name ?? "there";
  const eventCount = eventsQuery.data?.length ?? 0;
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}…${principal.slice(-3)}`
    : "";

  function handleLogout() {
    clear();
    navigate({ to: "/" });
  }

  const navCards = [
    {
      icon: Plus,
      label: "Add Event",
      description: "Create a new event with date and location",
      to: "/add-event" as const,
      accent: "bg-primary text-primary-foreground",
      marker: "dashboard.add_event_button",
    },
    {
      icon: List,
      label: "View Events",
      description: `Browse all ${eventCount} scheduled events`,
      to: "/events" as const,
      accent: "bg-accent text-accent-foreground",
      marker: "dashboard.view_events_button",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-muted-foreground text-sm mb-1 font-medium tracking-wide uppercase">
            Dashboard
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Welcome back,{" "}
            <span className="text-primary">
              {profileQuery.isLoading ? "…" : userName}
            </span>
            !
          </h1>
          {shortPrincipal && (
            <p className="text-muted-foreground text-sm mt-2">
              Principal: {shortPrincipal}
            </p>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Total Events
              </span>
            </div>
            <p className="font-display font-bold text-3xl text-foreground">
              {eventCount}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Active
              </span>
            </div>
            <p className="font-display font-bold text-3xl text-foreground">
              {eventCount}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Last Login
              </span>
            </div>
            <p className="font-display font-bold text-lg text-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </motion.div>

        {/* Navigation cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display font-semibold text-xl text-foreground mb-5">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {navCards.map((card) => (
              <Link key={card.label} to={card.to}>
                <Card
                  className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border"
                  data-ocid={card.marker}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${card.accent} flex items-center justify-center mb-4`}
                    >
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                      {card.label}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Logout card */}
            <Card
              className="group hover:shadow-card hover:border-destructive/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border"
              onClick={handleLogout}
              data-ocid="dashboard.logout_button"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-destructive transition-colors">
                  Logout
                </h3>
                <p className="text-muted-foreground text-sm">
                  End your current session safely
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} EVENTO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
