import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="flex flex-col items-center gap-4"
          data-ocid="events.loading_state"
        >
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Loading…</p>
        </div>
      </div>
    );
  }

  if (!identity || identity.getPrincipal().isAnonymous()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
