import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Search, Truck, MapPin, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwiftParcel — Track & Manage Courier Shipments" },
      {
        name: "description",
        content:
          "Book a courier, assign drivers and follow every parcel from pickup to delivery. Track any parcel with a tracking ID, no login needed.",
      },
      { property: "og:title", content: "SwiftParcel — Track & Manage Courier Shipments" },
      {
        property: "og:description",
        content: "Book a courier, assign drivers and follow every parcel from pickup to delivery.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Package className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">SwiftParcel</span>
          <nav className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/track">Track</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Sign up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-dark">
              <Truck className="size-3.5" /> Courier & logistics platform
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Every parcel, from pickup to doorstep.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Customers book shipments, admins assign drivers, drivers update each step, and
              receivers track live — all in one clean workspace.
            </p>

            <form
              className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim()) void navigate({ to: "/track", search: { id: code.trim() } });
              }}
            >
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Tracking ID e.g. TRK-2026-8F4K92"
                aria-label="Tracking ID"
              />
              <Button type="submit" className="sm:w-40">
                <Search className="size-4" /> Track Parcel
              </Button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: MapPin, title: "Live tracking", text: "Timeline of every status change with location and time." },
              { icon: Truck, title: "Driver workflow", text: "Accept, pick up, transit, deliver — with valid steps only." },
              { icon: ShieldCheck, title: "Role-based access", text: "Admins, drivers and customers each see only their own data." },
              { icon: Clock, title: "Fast booking", text: "Create a shipment and get a tracking ID instantly." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SwiftParcel Logistics
      </footer>
    </div>
  );
}
