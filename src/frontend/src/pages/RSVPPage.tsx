import { useSearch } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  PartyPopper,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetEventByInviteCode,
  useGetRSVPByCode,
  useSubmitRSVP,
} from "../hooks/useQueries";

export function RSVPPage() {
  const search = useSearch({ strict: false }) as { code?: string };
  const code = search.code ?? "";

  const { data: event, isLoading: eventLoading } =
    useGetEventByInviteCode(code);
  const { data: existingRsvp, isLoading: rsvpLoading } = useGetRSVPByCode(code);
  const submitMutation = useSubmitRSVP();

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const isLoading = eventLoading || rsvpLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (attending === null) {
      toast.error("Please select if you're attending.");
      return;
    }
    try {
      await submitMutation.mutateAsync({
        name: name.trim(),
        attending,
        inviteCode: code,
      });
      setSubmittedName(name.trim());
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit RSVP. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-lg mb-2"
          style={{ background: "oklch(0.38 0.11 162)" }}
        >
          <span className="text-xl">🎉</span>
          EVENTO
        </div>
        <p className="text-muted-foreground text-sm">Event Invitation</p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
        data-ocid="rsvp.card"
      >
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="rsvp.loading_state"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading invitation…</p>
          </div>
        )}

        {!isLoading && !code && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center"
            data-ocid="rsvp.error_state"
          >
            <p className="text-destructive font-semibold text-lg">
              Invalid invite link
            </p>
            <p className="text-muted-foreground text-sm">
              This link doesn't seem right. Please ask the organizer for a valid
              invite link.
            </p>
          </div>
        )}

        {!isLoading && code && event === null && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center"
            data-ocid="rsvp.error_state"
          >
            <p className="text-destructive font-semibold text-lg">
              Invalid invite link
            </p>
            <p className="text-muted-foreground text-sm">
              This invite link is no longer valid or doesn't exist.
            </p>
          </div>
        )}

        {!isLoading && event && existingRsvp && !submitted && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center"
            data-ocid="rsvp.success_state"
          >
            <CheckCircle2 className="w-12 h-12 text-primary" />
            <p className="font-semibold text-lg text-foreground">
              You've already responded
            </p>
            <p className="text-muted-foreground text-sm">
              You submitted as <strong>{existingRsvp.name}</strong> —{" "}
              {existingRsvp.attending ? "attending ✓" : "not attending"}
            </p>
          </div>
        )}

        {!isLoading && event && !existingRsvp && !submitted && (
          <>
            {/* Event info header */}
            <div
              className="px-6 py-5 text-white"
              style={{ background: "oklch(0.38 0.11 162)" }}
            >
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-1">
                You're invited to
              </p>
              <h1 className="font-display font-bold text-xl leading-snug">
                {event.title}
              </h1>
              <div className="flex flex-col gap-1.5 mt-3 text-sm opacity-90">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {event.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 space-y-5"
              data-ocid="rsvp.modal"
            >
              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1.5"
                  htmlFor="rsvp-name"
                >
                  Your Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  data-ocid="rsvp.input"
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-foreground mb-2">
                  Will you attend?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                      attending === true
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                    data-ocid="rsvp.toggle"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes, I'll be there
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                      attending === false
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-background text-muted-foreground hover:border-destructive/30"
                    }`}
                    data-ocid="rsvp.toggle"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Can't make it
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "oklch(0.38 0.11 162)" }}
                data-ocid="rsvp.submit_button"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </button>
            </form>
          </>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4"
            data-ocid="rsvp.success_state"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.1,
              }}
            >
              <PartyPopper className="w-14 h-14 text-primary" />
            </motion.div>
            <h2 className="font-display font-bold text-xl text-foreground">
              Thanks {submittedName}!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your RSVP has been recorded.{" "}
              {attending
                ? "We'll see you there! 🎉"
                : "Sorry you can't make it."}
            </p>
          </motion.div>
        )}
      </motion.div>

      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} EVENTO. All rights reserved.
      </p>
    </div>
  );
}
