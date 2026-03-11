import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Type,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAddEvent } from "../hooks/useQueries";

export function AddEventPage() {
  const navigate = useNavigate();
  const addEvent = useAddEvent();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    location?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Event title is required.";
    if (!date) e.date = "Please select a date.";
    if (!location.trim()) e.location = "Location is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addEvent.mutate(
      { title: title.trim(), date, location: location.trim() },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => navigate({ to: "/events" }), 1800);
        },
      },
    );
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
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <p className="text-muted-foreground text-sm mb-1 font-medium tracking-wide uppercase">
              Create
            </p>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Add New Event
            </h1>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6 text-primary"
                data-ocid="add_event.success_state"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">
                    Event created successfully!
                  </p>
                  <p className="text-xs text-primary/70">
                    Redirecting to your events…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {addEvent.isError && (
            <div
              className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6 text-destructive"
              data-ocid="add_event.error_state"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Failed to create event. Please try again.
              </p>
            </div>
          )}

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Event Details
              </CardTitle>
              <CardDescription>
                Fill in the details for your new event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-muted-foreground" />
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Annual Tech Summit 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={addEvent.isPending || showSuccess}
                    autoComplete="off"
                    data-ocid="add_event.title_input"
                  />
                  {errors.title && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                    Event Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={addEvent.isPending || showSuccess}
                    data-ocid="add_event.date_input"
                  />
                  {errors.date && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Grand Hyatt, New York City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={addEvent.isPending || showSuccess}
                    autoComplete="off"
                    data-ocid="add_event.location_input"
                  />
                  {errors.location && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-11 font-semibold"
                    disabled={addEvent.isPending || showSuccess}
                    data-ocid="add_event.submit_button"
                  >
                    {addEvent.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Event…
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                  <Link to="/events">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 px-6"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

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
