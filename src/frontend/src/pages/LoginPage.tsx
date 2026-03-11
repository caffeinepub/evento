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
import { AlertCircle, CalendarDays, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    identity,
    isLoggingIn,
    isLoginError,
    loginError,
    isInitializing,
  } = useInternetIdentity();

  useEffect(() => {
    if (!isInitializing && identity && !identity.getPrincipal().isAnonymous()) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

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
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in securely to access your event dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Display fields to match spec, actual auth via II */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="djeet5881@gmail.com"
                  autoComplete="email"
                  data-ocid="login.email_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  data-ocid="login.password_input"
                />
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  EVENTO uses secure decentralized identity. Clicking Sign In
                  will open a secure authentication window.
                </p>
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
                className="w-full h-11 font-semibold"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="login.submit_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
