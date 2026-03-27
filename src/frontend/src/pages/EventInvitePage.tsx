import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Link as LinkIcon,
  Loader2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import {
  useGenerateInviteCode,
  useGetInviteCodesForEvent,
  useGetRSVPsForEvent,
} from "../hooks/useQueries";

function formatTs(ts: bigint) {
  try {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}

export function EventInvitePage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string };
  const eventIdBig = BigInt(eventId ?? "0");

  const generateMutation = useGenerateInviteCode();
  const { data: codes, isLoading: codesLoading } =
    useGetInviteCodesForEvent(eventIdBig);
  const { data: rsvps, isLoading: rsvpsLoading } =
    useGetRSVPsForEvent(eventIdBig);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<string | null>(null);

  function inviteUrl(code: string) {
    return `${window.location.origin}/rsvp?code=${code}`;
  }

  async function handleGenerate() {
    try {
      const code = await generateMutation.mutateAsync(eventIdBig);
      const url = inviteUrl(code);
      setNewLink(url);
      toast.success("Invite link generated!");
    } catch {
      toast.error("Failed to generate invite link.");
    }
  }

  async function handleCopy(code: string) {
    await navigator.clipboard.writeText(inviteUrl(code));
    setCopiedCode(code);
    toast.success("Link copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto px-6 py-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <a
            href="/events"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            data-ocid="invite.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </a>

          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.38 0.11 162)" }}
            >
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Event #{eventId}
              </p>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Invite People
              </h1>
            </div>
          </div>

          {/* Generate new invite */}
          <section className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-1">
              Generate Invite Link
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Create a shareable link. Anyone with the link can RSVP without
              needing to log in.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="gap-2"
              data-ocid="invite.generate_button"
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LinkIcon className="w-4 h-4" />
              )}
              Generate New Invite Link
            </Button>

            {newLink && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4"
                data-ocid="invite.success_state"
              >
                <p className="text-xs font-medium text-primary mb-2">
                  New link ready!
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background rounded-lg px-3 py-2 border border-border truncate">
                    {newLink}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(newLink.split("code=")[1])}
                    className="shrink-0 gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Existing invite codes */}
          <section className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              All Invite Links
              {codes && (
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  {codes.length} link{codes.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>

            {codesLoading && (
              <div
                className="flex items-center gap-2 py-4"
                data-ocid="invite.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Loading links…
                </span>
              </div>
            )}

            {!codesLoading && (!codes || codes.length === 0) && (
              <div className="text-center py-8" data-ocid="invite.empty_state">
                <p className="text-muted-foreground text-sm">
                  No invite links yet. Generate one above.
                </p>
              </div>
            )}

            {!codesLoading && codes && codes.length > 0 && (
              <div className="space-y-3">
                {codes.map((ic, i) => (
                  <motion.div
                    key={ic.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                    {...(i < 3 ? { "data-ocid": `invite.item.${i + 1}` } : {})}
                  >
                    <div className="flex-1 min-w-0">
                      <code className="text-xs text-muted-foreground truncate block">
                        {inviteUrl(ic.code)}
                      </code>
                      <p className="text-xs text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTs(ic.created)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(ic.code)}
                      className="shrink-0 gap-1"
                      data-ocid={i < 3 ? `invite.item.${i + 1}` : undefined}
                    >
                      {copiedCode === ic.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* RSVPs */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              RSVPs Received
              {rsvps && (
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  {rsvps.length} response{rsvps.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>

            {rsvpsLoading && (
              <div
                className="flex items-center gap-2 py-4"
                data-ocid="rsvps.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Loading RSVPs…
                </span>
              </div>
            )}

            {!rsvpsLoading && (!rsvps || rsvps.length === 0) && (
              <div className="text-center py-8" data-ocid="rsvps.empty_state">
                <p className="text-muted-foreground text-sm">
                  No RSVPs yet. Share an invite link to get responses.
                </p>
              </div>
            )}

            {!rsvpsLoading && rsvps && rsvps.length > 0 && (
              <div className="space-y-2">
                {rsvps.map((rsvp, i) => (
                  <motion.div
                    key={`${rsvp.inviteCode}-${rsvp.name}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                    {...(i < 3 ? { "data-ocid": `rsvps.item.${i + 1}` } : {})}
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {rsvp.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatTs(rsvp.timestamp)}
                      </p>
                    </div>
                    {rsvp.attending ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: "oklch(0.38 0.11 162 / 0.12)",
                          color: "oklch(0.38 0.11 162)",
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
                        <XCircle className="w-3.5 h-3.5" />
                        Not attending
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </motion.div>
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
