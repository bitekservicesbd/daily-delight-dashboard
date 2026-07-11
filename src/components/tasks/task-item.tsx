import { useState } from "react";
import { format, isBefore, isToday, startOfDay } from "date-fns";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { PRIORITY_META, STATUS_META, type Task } from "@/lib/task-meta";
import { useDeleteTask, useUpdateTask } from "@/hooks/use-tasks";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const done = task.status === "done";

  function toggleDone(checked: boolean) {
    updateTask.mutate({
      id: task.id,
      status: checked ? "done" : "todo",
    });
  }

  async function handleDelete() {
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Could not delete task");
    }
  }

  const due = task.due_date ? new Date(`${task.due_date}T00:00:00`) : null;
  const overdue = due && !done && isBefore(due, startOfDay(new Date()));
  const dueToday = due && !done && isToday(due);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-soft transition-colors",
        done && "opacity-70",
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={(v) => toggleDone(Boolean(v))}
        className="mt-1"
        aria-label="Mark task done"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-semibold leading-snug",
              done && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={PRIORITY_META[task.priority].badgeClass}>
            {PRIORITY_META[task.priority].label}
          </Badge>
          <Badge variant="secondary" className={STATUS_META[task.status].badgeClass}>
            {STATUS_META[task.status].label}
          </Badge>
          {due && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                overdue
                  ? "text-destructive"
                  : dueToday
                    ? "text-accent-foreground"
                    : "text-muted-foreground",
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              {overdue
                ? `Overdue · ${format(due, "MMM d")}`
                : dueToday
                  ? "Due today"
                  : format(due, "MMM d, yyyy")}
            </span>
          )}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              “{task.title}” will be permanently removed. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}