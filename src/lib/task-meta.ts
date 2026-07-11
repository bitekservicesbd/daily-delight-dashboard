import type { Database } from "@/integrations/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; badgeClass: string }
> = {
  low: {
    label: "Low",
    badgeClass: "bg-secondary text-secondary-foreground",
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-accent/25 text-accent-foreground",
  },
  high: {
    label: "High",
    badgeClass: "bg-destructive/15 text-destructive",
  },
};

export const STATUS_META: Record<
  TaskStatus,
  { label: string; badgeClass: string }
> = {
  todo: {
    label: "To do",
    badgeClass: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "In progress",
    badgeClass: "bg-primary/12 text-primary",
  },
  done: {
    label: "Done",
    badgeClass: "bg-success/15 text-success",
  },
};

export const PRIORITY_ORDER: TaskPriority[] = ["high", "medium", "low"];
export const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];