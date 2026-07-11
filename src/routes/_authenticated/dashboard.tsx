import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  LogOut,
  Plus,
  Timer,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskItem } from "@/components/tasks/task-item";
import { useTasks } from "@/hooks/use-tasks";
import {
  PRIORITY_ORDER,
  STATUS_ORDER,
  type Task,
  type TaskStatus,
} from "@/lib/task-meta";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Filter = "all" | TaskStatus;

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tasks, isLoading } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userData.user.id)
        .maybeSingle();
      return {
        email: userData.user.email ?? "",
        display_name: data?.display_name ?? userData.user.email?.split("@")[0] ?? "",
        avatar_url: data?.avatar_url ?? null,
      };
    },
  });

  const stats = useMemo(() => {
    const list = tasks ?? [];
    return {
      total: list.length,
      todo: list.filter((t) => t.status === "todo").length,
      in_progress: list.filter((t) => t.status === "in_progress").length,
      done: list.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const list = tasks ?? [];
    const filtered =
      filter === "all" ? list : list.filter((t) => t.status === filter);
    return [...filtered].sort((a, b) => {
      // Not-done first, then by due date, then by priority.
      if ((a.status === "done") !== (b.status === "done")) {
        return a.status === "done" ? 1 : -1;
      }
      if (a.due_date && b.due_date && a.due_date !== b.due_date) {
        return a.due_date < b.due_date ? -1 : 1;
      }
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      return (
        PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
      );
    });
  }, [tasks, filter]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function openNew() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  const profile = profileQuery.data;
  const initials = (profile?.display_name || profile?.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight">Kanso</span>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">
                {profile?.display_name}
              </p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Avatar className="h-9 w-9">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt="" />
              )}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your tasks</h1>
            <p className="text-sm text-muted-foreground">
              {stats.total === 0
                ? "Nothing here yet — add your first task."
                : `${stats.done} of ${stats.total} done`}
            </p>
          </div>
          <Button onClick={openNew} className="mt-3 sm:mt-0">
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={ClipboardList} label="Total" value={stats.total} />
          <StatCard icon={CircleDashed} label="To do" value={stats.todo} />
          <StatCard icon={Timer} label="In progress" value={stats.in_progress} />
          <StatCard icon={CheckCircle2} label="Done" value={stats.done} />
        </div>

        <div className="mt-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {STATUS_ORDER.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {s === "todo"
                    ? "To do"
                    : s === "in_progress"
                      ? "In progress"
                      : "Done"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-5 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : visibleTasks.length === 0 ? (
            <EmptyState
              hasTasks={stats.total > 0}
              onAdd={openNew}
            />
          ) : (
            visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={openEdit} />
            ))
          )}
        </div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({
  hasTasks,
  onAdd,
}: {
  hasTasks: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold">
        {hasTasks ? "Nothing in this view" : "No tasks yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasTasks
          ? "Try a different filter or add a new task."
          : "Create your first task to get started."}
      </p>
      {!hasTasks && (
        <Button onClick={onAdd} className="mt-4">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      )}
    </div>
  );
}