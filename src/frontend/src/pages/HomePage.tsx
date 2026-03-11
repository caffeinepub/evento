import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: CalendarDays,
    title: "Schedule with Precision",
    description:
      "Plan events with exact dates, times, and detailed scheduling tools built for busy organizers.",
  },
  {
    icon: MapPin,
    title: "Location Management",
    description:
      "Track venues and locations for every event in one centralized, searchable dashboard.",
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description:
      "Invite team members, assign roles, and coordinate across your entire organization.",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-primary-foreground">
              EVENTO
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="outline"
                className="border-white/70 text-white bg-white/10 hover:bg-white/20 hover:text-white font-semibold"
                data-ocid="nav.login_link"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                data-ocid="nav.register_link"
              >
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          background: "oklch(0.25 0.06 162)",
        }}
      >
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-event.dim_1200x600.jpg')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background/30" />
        {/* Decorative circles */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.14 72), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.15 200), transparent 70%)",
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-sm font-medium tracking-wide">
                Simple. Smart. Seamless.
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95] tracking-tight mb-8"
          >
            Plan Less,
            <br />
            <span style={{ color: "oklch(0.72 0.14 72)" }}>Celebrate More</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="text-white text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Create and manage your events in minutes. No stress, no hassle —
            just great experiences worth remembering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8 h-12 gap-2 group"
                data-ocid="nav.register_link"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/70 text-white bg-white/10 hover:bg-white/20 hover:text-white font-semibold text-base px-8 h-12"
                data-ocid="nav.login_link"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Everything you need to run great events
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From private gatherings to large-scale conferences, EVENTO scales
              with you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "oklch(0.38 0.11 162 / 0.10)" }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ background: "oklch(0.25 0.06 162)" }}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground mb-6">
              Ready to elevate your events?
            </h2>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12"
                data-ocid="nav.register_link"
              >
                Create Your Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <CalendarDays className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm text-foreground">
              EVENTO
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} EVENTO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
