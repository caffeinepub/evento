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
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CalendarDays, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile } from "../hooks/useQueries";

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    login,
    identity,
    isLoggingIn,
    isLoginError,
    loginError,
    isInitializing,
  } = useInternetIdentity();
  const saveProfile = useSaveUserProfile();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [hasSavedProfile, setHasSavedProfile] = useState(false);

  // After identity is set and we haven't saved profile yet, save it
  useEffect(() => {
    if (
      identity &&
      !identity.getPrincipal().isAnonymous() &&
      name &&
      !hasSavedProfile
    ) {
      setHasSavedProfile(true);
      saveProfile.mutate(
        { name },
        {
          onSuccess: () => navigate({ to: "/dashboard" }),
          onError: () => navigate({ to: "/dashboard" }),
        },
      );
    }
  }, [identity, name, hasSavedProfile, saveProfile, navigate]);

  // If already logged in, go to dashboard
  useEffect(() => {
    if (
      !isInitializing &&
      identity &&
      !identity.getPrincipal().isAnonymous() &&
      !name
    ) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, name, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    if (!name.trim()) {
      setNameError("Please enter your name.");
      return;
    }
    login();
  }

  const isPending = isLoggingIn || saveProfile.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              EVENTO
            </span>
          </Link>
        </div>

        <Card className="border-border shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-2xl">
              Create your account
            </CardTitle>
            <CardDescription>
              Enter your name to get started. You'll connect via secure login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  autoComplete="name"
                  data-ocid="register.name_input"
                />
                {nameError && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {nameError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email{" "}
                  <span className="text-muted-foreground text-xs">
                    (display only)
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  disabled={isPending}
                  autoComplete="email"
                  data-ocid="register.email_input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password{" "}
                  <span className="text-muted-foreground text-xs">
                    (display only)
                  </span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  autoComplete="new-password"
                  data-ocid="register.password_input"
                />
              </div>

              {isLoginError && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                  data-ocid="add_event.error_state"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {loginError?.message ?? "Login failed. Please try again."}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={isPending}
                data-ocid="register.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up your account…
                  </>
                ) : (
                  "Register & Connect"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
