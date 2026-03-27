import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import {
  useAddAttendee,
  useGetAllEvents,
  useGetAttendees,
  useRemoveAttendee,
} from "../hooks/useQueries";

export function EventPeoplePage() {
  const params = useParams({ strict: false }) as { eventId?: string };
  const eventId = BigInt(params.eventId ?? "0");

  const { data: events } = useGetAllEvents();
  const event = events?.find((e) => e.id.toString() === eventId.toString());

  const { data: attendees, isLoading } = useGetAttendees(eventId);
  const addAttendee = useAddAttendee();
  const removeAttendee = useRemoveAttendee();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addAttendee.mutateAsync({
        eventId,
        name: name.trim(),
        email: email.trim(),
      });
      toast.success("Person added successfully");
      setName("");
      setEmail("");
    } catch {
      toast.error("Failed to add person");
    }
  }

  async function handleRemove(attendeeId: bigint) {
    try {
      await removeAttendee.mutateAsync({ attendeeId, eventId });
      toast.success("Person removed");
    } catch {
      toast.error("Failed to remove person");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="/events"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            data-ocid="people.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </a>

          <div className="mb-8">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase mb-1">
              Attendees
            </p>
            <h1 className="font-display font-bold text-3xl text-foreground">
              {event ? event.title : "Event"}
            </h1>
            {attendees && (
              <p className="text-muted-foreground text-sm mt-1">
                {attendees.length}{" "}
                {attendees.length === 1 ? "person" : "people"} registered
              </p>
            )}
          </div>

          {/* Add person form */}
          <Card className="mb-8 border-border" data-ocid="people.card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                Add a Person
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="person-name">Full Name</Label>
                    <Input
                      id="person-name"
                      placeholder="Jeet Sushil Das"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-ocid="people.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="person-email">Email</Label>
                    <Input
                      id="person-email"
                      type="email"
                      placeholder="djeet5881@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-ocid="people.search_input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto gap-2"
                  disabled={addAttendee.isPending}
                  data-ocid="people.submit_button"
                >
                  {addAttendee.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {addAttendee.isPending ? "Adding\u2026" : "Add Person"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Attendees list */}
          {isLoading && (
            <div
              className="flex items-center justify-center py-16 gap-3"
              data-ocid="people.loading_state"
            >
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading people\u2026</p>
            </div>
          )}

          {!isLoading && attendees && attendees.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="people.empty_state"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "oklch(0.38 0.11 162 / 0.08)" }}
              >
                <Users className="w-8 h-8 text-primary/40" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                No people added yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Use the form above to add attendees to this event.
              </p>
            </motion.div>
          )}

          {!isLoading && attendees && attendees.length > 0 && (
            <div className="space-y-3" data-ocid="people.list">
              <AnimatePresence>
                {attendees.map((attendee, i) => {
                  const idx = i + 1;
                  return (
                    <motion.div
                      key={attendee.id.toString()}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(i * 0.05, 0.3),
                      }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
                      {...(idx <= 3
                        ? { "data-ocid": `people.item.${idx}` }
                        : {})}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm"
                        style={{ background: "oklch(0.38 0.11 162)" }}
                      >
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {attendee.name}
                        </p>
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {attendee.email}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(attendee.id)}
                        disabled={removeAttendee.isPending}
                        {...(idx <= 3
                          ? { "data-ocid": `people.delete_button.${idx}` }
                          : {})}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="py-6 border-t border-border mt-10">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground text-sm text-center">
            \u00a9 {new Date().getFullYear()} EVENTO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
