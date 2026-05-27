import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, BarChart3, GitBranch, GitMerge, Gauge, Users, Settings as SettingsIcon,
  Search, Github, Gitlab, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/lib/settings";
import { GlobalSearch } from "./global-search";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Overview", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: GitBranch },
  { to: "/users", label: "Users", icon: Users },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/pipelines", label: "Pipelines", icon: Zap },
  { to: "/dora", label: "DORA", icon: Gauge },
  { to: "/compare", label: "Compare", icon: GitMerge },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { provider, token } = useSettings();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ProviderIcon = provider === "github" ? Github : Gitlab;

  const isActive = useMemo(
    () => (to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(to + "/")),
    [path],
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-sidebar/60 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-[#0b1220] font-black">D</div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">DevMetrics</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">analytics suite</div>
          </div>
        </div>
        <nav className="px-2 flex-1 space-y-0.5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-sidebar-accent text-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60")
                }
              >
                <Icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
          <ProviderIcon className="size-3.5" />
          <span className="capitalize">{provider}</span>
          <span className={"ml-auto size-1.5 rounded-full " + (token ? "bg-emerald-400" : "bg-rose-400")} />
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 md:px-8 h-14">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground gap-2 w-full max-w-md justify-start"
            >
              <Search className="size-4" />
              <span className="text-xs">Search projects, users, commits…</span>
              <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border">⌘K</kbd>
            </Button>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">v4 · live</span>
            </div>
          </div>
          <nav className="md:hidden flex gap-1 px-3 pb-2 overflow-x-auto">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "text-xs whitespace-nowrap px-3 py-1.5 rounded-md " +
                  (isActive(n.to) ? "bg-sidebar-accent text-foreground" : "text-muted-foreground")
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>
        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </div>
  );
}