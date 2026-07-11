import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Flag,
  ListChecks,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Due dates that stick",
    description:
      "Give every task a deadline and spot what's due today or overdue at a glance.",
  },
  {
    icon: Flag,
    title: "Priorities that guide",
    description:
      "Flag tasks low, medium, or high so the most important work always rises up.",
  },
  {
    icon: ListChecks,
    title: "Progress you can track",
    description:
      "Move tasks from to-do to in progress to done and watch your day come together.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-lg font-extrabold tracking-tight">Kanso</span>
        <Button asChild variant="ghost" size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Simple task management
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Bring calm focus to everything you need to do.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Kanso is a clean, private task manager. Capture tasks with due dates
            and priorities, then track them from start to done on one focused
            dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/auth">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-hero px-6 py-14 text-center text-primary-foreground shadow-lifted sm:px-12">
            <h2 className="mx-auto max-w-lg text-3xl font-bold tracking-tight">
              Ready to clear your head?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
              Create your account and start organizing your tasks in minutes.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/auth">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Kanso. Your tasks, kept simple.
        </div>
      </footer>
    </div>
  );
}
