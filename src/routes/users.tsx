import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useAggregateCommits, useMembers, useRepos } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import { leaderboard } from "@/lib/metrics";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/users")({ component: UsersPage });

function UsersPage() {
  const { token } = useSettings();
  const members = useMembers();
  const repos = useRepos();
  const commits = useAggregateCommits(repos.data, 30, 10);
  const [q, setQ] = useState("");

  const board = useMemo(() => leaderboard(commits.data ?? []), [commits.data]);
  const byAuthor = useMemo(() => new Map(board.map((b) => [b.author.toLowerCase(), b.count])), [board]);

  const list = useMemo(() => {
    const base = members.data ?? [];
    const enriched = base.map((m) => ({
      ...m, commits: byAuthor.get(m.login.toLowerCase()) ?? 0,
    }));
    const ql = q.toLowerCase();
    return enriched
      .filter((m) => !q || m.login.toLowerCase().includes(ql) || (m.name ?? "").toLowerCase().includes(ql))
      .sort((a, b) => b.commits - a.commits);
  }, [members.data, byAuthor, q]);

  if (!token) return <NoToken />;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Ranking by commits · 30d</p>
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="max-w-xs" />
      </div>

      {members.error && <ErrorState message={(members.error as Error).message} />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((m, i) => (
          <Link key={m.id} to="/users/$login" params={{ login: m.login }}>
            <Card className="p-4 bg-card/60 backdrop-blur glow flex items-center gap-3 hover:border-primary/60 transition-colors">
              <span className="size-6 grid place-items-center rounded-md bg-muted text-[10px] tabular-nums">{i + 1}</span>
              <Avatar className="size-10">
                <AvatarImage src={m.avatar} />
                <AvatarFallback>{m.login.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{m.name ?? m.login}</div>
                <div className="text-xs text-muted-foreground truncate">@{m.login}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums">{m.commits}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">commits</div>
              </div>
            </Card>
          </Link>
        ))}
        {!list.length && (
          <div className="text-sm text-muted-foreground">
            {members.isLoading ? "Loading…" : "No users found"}
          </div>
        )}
      </div>
    </div>
  );
}