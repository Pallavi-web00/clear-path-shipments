import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Package, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth, homeForRole } from "@/lib/auth";
import type { AppRole } from "@/lib/logistics";
import { NotificationBell } from "@/components/NotificationBell";
import { LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export function RoleGuard({ allow, children }: { allow: AppRole; children: ReactNode }) {
  const { loading, session, role } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <LoadingState label="Checking your access…" />
      </div>
    );
  }
  if (!session) {
    void navigate({ to: "/login" });
    return (
      <div className="grid min-h-screen place-items-center">
        <LoadingState label="Redirecting to sign in…" />
      </div>
    );
  }
  if (role !== allow) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <h1 className="text-lg font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is for {allow} accounts only.
          </p>
          <Button className="mt-5" onClick={() => void navigate({ to: homeForRole(role) })}>
            Go to my dashboard
          </Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export function AppShell({
  title,
  nav,
  children,
  actions,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
  actions?: ReactNode;
}) {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/" });
  };

  const SidebarBody = (
    <div className="flex h-full flex-col gap-1 p-4">
      <Link to="/" className="mb-5 flex items-center gap-2 px-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Package className="size-5" />
        </span>
        <span className="text-base font-extrabold tracking-tight">SwiftParcel</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => void handleSignOut()}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">
        {SidebarBody}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card shadow-xl">
            <button
              className="absolute top-4 right-4 text-muted-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {SidebarBody}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <button
            className="grid size-9 place-items-center rounded-xl border border-border lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
          <h1 className="truncate text-base font-bold sm:text-lg">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <NotificationBell />
            <div className="hidden items-center gap-2 rounded-xl border border-border px-3 py-1.5 sm:flex">
              <span className="grid size-7 place-items-center rounded-lg bg-accent text-xs font-bold text-primary-dark">
                {(profile?.name || "U").slice(0, 1).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="max-w-32 truncate text-xs font-semibold">{profile?.name || "User"}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
