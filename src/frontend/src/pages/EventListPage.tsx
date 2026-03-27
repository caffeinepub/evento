import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CalendarX2,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import {
  useDeleteEvent,
  useGetAllEvents,
  useGetAttendees,
} from "../hooks/useQueries";

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-US", { day: "2-digit" }),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      year: d.getFullYear().toString(),
      full: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  } catch {
    return { day: "\u2014", month: "\u2014", year: "\u2014", full: dateStr };
  }
}

function AttendeeCount({ eventId }: { eventId: bigint }) {
  const { data: attendees, isLoading } = useGetAttendees(eventId);
  if (isLoading)
    return <span className="text-muted-foreground text-xs">...</span>;
  const count = attendees?.length ?? 0;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: "oklch(0.38 0.11 162 / 0.12)",
        color: "oklch(0.38 0.11 162)",
      }}
    >
      <Users className="w-3 h-3" />
      {count} {count === 1 ? "person" : "people"}
    </span>
  );
}

export function EventListPage() {
  const { data: events, isLoading, isError } = useGetAllEvents();
  const deleteEvent = useDeleteEvent();

  async function handleDelete(id: bigint, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  }

  function goToPeople(id: string) {
    window.location.href = `/events/${id}/people`;
  }

  function goToInvite(id: string) {
    window.location.href = `/events/${id}/invite`;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <p className="text-muted-foreground text-sm mb-1 font-medium tracking-wide uppercase">
              Manage
            </p>
            <h1 className="font-display font-bold text-3xl text-foreground">
              All Events
              {events && events.length > 0 && (
                <span className="ml-3 text-base font-normal text-muted-foreground">
                  ({events.length})
                </span>
              )}
            </h1>
          </div>
          <Link to="/add-event">
            <Button
              className="gap-2 shrink-0"
              data-ocid="dashboard.add_event_button"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </Link>
        </motion.div>

        {isLoading && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="events.loading_state"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading events\u2026</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-24">
            <p className="text-destructive">Failed to load events.</p>
          </div>
        )}

        {!isLoading && !isError && events && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="events.empty_state"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "oklch(0.38 0.11 162 / 0.08)" }}
            >
              <CalendarX2 className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              No events yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xs">
              Your event list is empty. Start by adding your first event.
            </p>
            <Link to="/add-event">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Event
              </Button>
            </Link>
          </motion.div>
        )}

        {!isLoading && !isError && events && events.length > 0 && (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="events.list"
          >
            {events.map((event, i) => {
              const date = formatDate(event.date);
              const idx = i + 1;
              const eventIdStr = event.id.toString();
              return (
                <motion.div
                  key={eventIdStr}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
                  className="group rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  {...(idx <= 3 ? { "data-ocid": `events.item.${idx}` } : {})}
                >
                  <div className="flex">
                    <div
                      className="flex flex-col items-center justify-center w-20 shrink-0 py-6 text-primary-foreground"
                      style={{ background: "oklch(0.38 0.11 162)" }}
                    >
                      <span className="font-display font-bold text-2xl leading-none">
                        {date.day}
                      </span>
                      <span className="font-sans text-xs font-semibold tracking-wider mt-1 opacity-80">
                        {date.month}
                      </span>
                      <span className="font-sans text-xs opacity-60 mt-0.5">
                        {date.year}
                      </span>
                    </div>

                    <div className="flex-1 p-5">
                      <h3 className="font-display font-semibold text-foreground text-base mb-3 line-clamp-2 leading-snug">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-accent" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-2">
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        <span>{date.full}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="mb-3">
                          <AttendeeCount eventId={event.id} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => goToPeople(eventIdStr)}
                            {...(idx <= 3
                              ? { "data-ocid": `events.item.${idx}.button` }
                              : {})}
                          >
                            <Users className="w-3.5 h-3.5" />
                            People
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => goToInvite(eventIdStr)}
                            {...(idx <= 3
                              ? {
                                  "data-ocid": `events.item.${idx}.secondary_button`,
                                }
                              : {})}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Invite
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={deleteEvent.isPending}
                            {...(idx <= 3
                              ? { "data-ocid": `events.delete_button.${idx}` }
                              : {})}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-border mt-10">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground text-sm text-center">
            &copy; {new Date().getFullYear()} EVENTO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
