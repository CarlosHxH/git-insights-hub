import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Activity, GitBranch, GitCommit, Star, Users, Zap } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Heatmap } from "@/components/heatmap";
import { CommitChart } from "@/components/commit-chart";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useAggregateCommits, useAggregatePipelines, useMembers, useRepos } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import { leaderboard, pipelineStats } from "@/lib/metrics";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { token } = useSettings();
  const repos = useRepos();
  const members = useMembers();
  const commits = useAggregateCommits(repos.data, 30, 10);
  const pipes = useAggregatePipelines(repos.data, 10);

  if (!token) return <NoToken />;

  const totalStars = (repos.data ?? []).reduce((a, b) => a + b.stars, 0);
  const totalIssues = (repos.data ?? []).reduce((a, b) => a + b.openIssues, 0);
  const dates = (commits.data ?? []).map((c) => c.date);
  const top = useMemo(() => leaderboard(commits.data ?? []).slice(0, 6), [commits.data]);
  const ps = pipelineStats(pipes.data ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Live engineering signals across your projects · last 30 days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <KpiCard label="Projects" value={repos.data?.length ?? "—"} icon={GitBranch} hint="repositories" />
        <KpiCard label="People" value={members.data?.length ?? "—"} icon={Users} hint="members" />
        <KpiCard label="Commits" value={commits.data?.length ?? "—"} icon={GitCommit} hint="30d" />
        <KpiCard label="Pipelines" value={ps.total} icon={Zap} hint={`${ps.successRate.toFixed(0)}% green`} />
        <KpiCard label="Open issues" value={totalIssues} icon={Activity} />
        <KpiCard label="Total stars" value={totalStars} icon={Star} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Commit velocity</h3>
            <span className="text-xs text-muted-foreground">last 30 days</span>
          </div>
          {commits.isLoading ? (
            <Skel h={220} />
          ) : commits.error ? (
            <ErrorState message={(commits.error as Error).message} />
          ) : (
            <CommitChart dates={dates} days={30} />
          )}
        </Card>

        <Card className="p-5 bg-card/60 backdrop-blur glow">
          <h3 className="text-sm font-semibold mb-3">Top contributors</h3>
          <ol className="space-y-2">
            {top.length === 0 && <li className="text-xs text-muted-foreground">No commits yet.</li>}
            {top.map((t, i) => (
              <li key={t.author} className="flex items-center gap-3 text-sm">
                <span className="size-6 grid place-items-center rounded-md bg-muted text-[10px] tabular-nums">
                  {i + 1}
                </span>
                <span className="truncate flex-1">{t.author}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{t.count}</span>
                <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                    style={{ width: `${(t.count / top[0].count) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Activity heatmap</h3>
          <span className="text-xs text-muted-foreground">~6 months · aggregated</span>
        </div>
        <Heatmap dates={dates} weeks={26} />
      </Card>

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent projects</h3>
          <Link to="/projects" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(repos.data ?? []).slice(0, 6).map((r) => (
            <Link
              key={r.id}
              to="/projects/$id"
              params={{ id: encodeURIComponent(r.fullName) }}
              className="rounded-lg border border-border bg-background/40 p-4 hover:border-primary/60 transition-colors block"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{r.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.visibility}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.description || "No description"}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>★ {r.stars}</span>
                <span>⑂ {r.forks}</span>
                <span>● {r.openIssues}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Skel({ h }: { h: number }) {
  return <div className="animate-pulse rounded-md bg-muted/50" style={{ height: h }} />;
}
