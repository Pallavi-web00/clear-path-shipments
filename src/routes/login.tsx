import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, homeForRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { seedDemoData } from "@/lib/admin.functions";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SwiftParcel" },
      { name: "description", content: "Sign in to your SwiftParcel account to manage shipments, drivers and deliveries." },
      { property: "og:title", content: "Login — SwiftParcel" },
      { property: "og:description", content: "Sign in to manage shipments, drivers and deliveries." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { session, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && session && role) void navigate({ to: homeForRole(role) as never });
  }, [loading, session, role, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
  };

  const loadDemo = async () => {
    setSeeding(true);
    try {
      const res = await seedDemoData();
      toast.success(res.created ? "Demo accounts created." : "Demo accounts already exist.");
    } catch {
      toast.error("Could not create demo data.");
    }
    setSeeding(false);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15">
            <Package className="size-5" />
          </span>
          <span className="text-lg font-extrabold">SwiftParcel</span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold">Move parcels with confidence.</h2>
          <p className="mt-3 max-w-sm text-sm opacity-90">
            One workspace for customers, drivers and operations teams.
          </p>
        </div>
        <p className="text-xs opacity-75">© {new Date().getFullYear()} SwiftParcel Logistics</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Package className="size-5" />
            </span>
            <span className="text-lg font-extrabold">SwiftParcel</span>
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Admins, drivers and customers use the same login.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              <LogIn className="size-4" /> {busy ? "Signing in…" : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            New customer?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
            <p className="font-semibold">Demo workspace</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create sample admin, driver and customer accounts to explore the full workflow.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>
                <strong>Admin:</strong> admin@swiftparcel.app / Admin@12345
              </li>
              <li>
                <strong>Driver:</strong> driver@swiftparcel.app / Driver@12345
              </li>
              <li>
                <strong>Customer:</strong> customer@swiftparcel.app / Customer@12345
              </li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => void loadDemo()}
              disabled={seeding}
            >
              {seeding ? "Creating demo data…" : "Load demo data"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
