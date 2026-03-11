import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CalendarDays, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function AppHeader() {
  const { clear } = useInternetIdentity();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            EVENTO
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground hover:text-destructive gap-2"
            data-ocid="nav.logout_button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
