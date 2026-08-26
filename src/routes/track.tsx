import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Search, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { TrackingTimeline, type TimelineEvent } from "@/components/TrackingTimeline";
import { LoadingState } from "@/components/States";
import { formatDate, formatDateTime, type ShipmentStatus } from "@/lib/logistics";

type PublicTracking = {
  tracking_id: string;
  status: ShipmentStatus;
  pickup_location: string;
  delivery_location: string;
  shipment_date: string;
  pickup_date: string | null;
  expected_delivery_date: string | null;
  delivered_at: string | null;
  events: TimelineEvent[];
};

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" && search["id"] ? { id: search["id"] } : {},
  head: () => ({
    meta: [
      { title: "Track Your Parcel — SwiftParcel" },
      {
        name: "description",
        content: "Enter your SwiftParcel tracking ID to see live parcel status, route and delivery timeline. No login required.",
      },
      { property: "og:title", content: "Track Your Parcel — SwiftParcel" },
      { property: "og:description", content: "Enter your tracking ID to see live parcel status and delivery timeline." },
    ],
  }),
  component: TrackPage,
});

export function TrackPanel({ initialId }: { initialId?: string | undefined }) {
  const [value, setValue] = useState(initialId ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async (trackingId: string) => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const { data, error: rpcError } = await supabase.rpc("track_parcel", {
      _tracking_id: trackingId.trim(),
    });
    setLoading(false);
    if (rpcError || !data) {
      setError("Tracking ID not found. Please check your Tracking ID and try again.");
      return;
    }
    setResult(data as unknown as PublicTracking);
  };

  useEffect(() => {
    if (initialId) void search(initialId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void search(value);
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tracking ID e.g. TRK-2026-8F4K92"
          aria-label="Tracking ID"
        />
        <Button type="submit" className="sm:w-40" disabled={loading}>
          <Search className="size-4" /> Track Parcel
        </Button>
      </form>

      {loading ? <LoadingState label="Looking up your parcel…" /> : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/8 p-5 text-sm font-medium text-destructive">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Tracking ID</p>
                <p className="text-xl font-extrabold tracking-tight">{result.tracking_id}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field icon={MapPin} label="Pickup location" value={result.pickup_location || "—"} />
              <Field icon={MapPin} label="Delivery location" value={result.delivery_location || "—"} />
              <Field icon={Calendar} label="Shipment date" value={formatDate(result.shipment_date)} />
              <Field
                icon={Calendar}
                label="Expected delivery"
                value={formatDate(result.expected_delivery_date)}
              />
              <Field
                icon={Package}
                label="Current status"
                value={`${result.status}${
                  result.events.length
                    ? ` • ${result.events[result.events.length - 1]?.location || "In network"}`
                    : ""
                }`}
              />
              <Field
                icon={Calendar}
                label="Delivered at"
                value={result.delivered_at ? formatDateTime(result.delivered_at) : "—"}
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="mb-5 text-base font-bold">Tracking timeline</h3>
            <TrackingTimeline events={result.events ?? []} currentStatus={result.status} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
        <Icon className="size-3.5 text-primary" /> {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function TrackPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  useEffect(() => {
    void navigate;
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Package className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">SwiftParcel</span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Track Your Parcel</h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Enter the tracking ID shared with you. No account needed.
        </p>
        <TrackPanel initialId={id} />
      </main>
    </div>
  );
}
