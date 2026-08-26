import { Check, Circle, Dot } from "lucide-react";
import { STATUS_FLOW, formatDateTime, type ShipmentStatus } from "@/lib/logistics";
import { cn } from "@/lib/utils";

export type TimelineEvent = {
  status: ShipmentStatus;
  location?: string | null;
  description?: string | null;
  created_at: string;
  updated_by?: string | null;
};

export function TrackingTimeline({
  events,
  currentStatus,
}: {
  events: TimelineEvent[];
  currentStatus: ShipmentStatus;
}) {
  const done = new Set(events.map((e) => e.status));
  const terminal = currentStatus === "Cancelled" || currentStatus === "Rejected";
  const future = terminal ? [] : STATUS_FLOW.filter((s) => !done.has(s) && s !== currentStatus);

  return (
    <ol className="relative space-y-6">
      {events.map((event, i) => {
        const isCurrent = i === events.length - 1;
        return (
          <li key={`${event.status}-${event.created_at}-${i}`} className="relative flex gap-4 pl-1">
            <span className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-primary-foreground",
                  isCurrent ? "bg-primary shadow-[var(--shadow-glow)]" : "bg-primary-dark",
                )}
              >
                {isCurrent ? <Dot className="size-5" /> : <Check className="size-4" />}
              </span>
              <span className="mt-1 w-px flex-1 bg-primary/30" />
            </span>
            <div className="pb-1">
              <p className="font-semibold">{event.status}</p>
              <p className="text-sm text-muted-foreground">{formatDateTime(event.created_at)}</p>
              {event.location ? (
                <p className="text-sm text-muted-foreground">📍 {event.location}</p>
              ) : null}
              {event.description ? <p className="mt-1 text-sm">{event.description}</p> : null}
              {event.updated_by ? (
                <p className="mt-0.5 text-xs text-muted-foreground">Updated by {event.updated_by}</p>
              ) : null}
            </div>
          </li>
        );
      })}

      {future.map((status) => (
        <li key={status} className="relative flex gap-4 pl-1 opacity-55">
          <span className="flex flex-col items-center">
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground">
              <Circle className="size-3" />
            </span>
            <span className="mt-1 w-px flex-1 bg-border" />
          </span>
          <div>
            <p className="font-medium text-muted-foreground">{status}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
