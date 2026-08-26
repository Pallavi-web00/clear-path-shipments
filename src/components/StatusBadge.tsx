import { statusTone, type ShipmentStatus } from "@/lib/logistics";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  muted: "bg-muted text-muted-foreground",
  info: "bg-accent text-accent-foreground",
  warning: "bg-warning/15 text-warning",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/12 text-destructive",
};

export function StatusBadge({ status, className }: { status: ShipmentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneClass[statusTone(status)],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
