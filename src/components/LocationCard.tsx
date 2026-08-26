import { MapPin, Phone, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocationCard({
  title,
  variant = "pickup",
  name,
  phone,
  address,
  city,
  state,
  postalCode,
  dateLabel,
  date,
}: {
  title: string;
  variant?: "pickup" | "delivery";
  name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  dateLabel: string;
  date: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-[var(--shadow-soft)]",
        variant === "pickup" ? "border-primary/25 bg-accent/50" : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <MapPin className="size-4" />
        </span>
        <h3 className="text-sm font-bold tracking-wide text-primary-dark uppercase">{title}</h3>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="font-semibold">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-primary" />
          <span>{phone || "—"}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            {address || "—"}
            <br />
            {[city, state].filter(Boolean).join(", ")} {postalCode}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span>
            {dateLabel}: <strong>{date}</strong>
          </span>
        </div>
      </dl>
    </div>
  );
}

export function RouteConnector() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-2 text-primary">
      <span className="h-6 w-px bg-primary/40" />
      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-dark">
        🚚 Shipment route
      </span>
      <span className="h-6 w-px bg-primary/40" />
    </div>
  );
}
