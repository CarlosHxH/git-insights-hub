import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { CommitChart } from "@/components/commit-chart";
import { Heatmap } from "@/components/heatmap";
import { useRepoCommits, useRepoIssues, useRepoPipelines, useRepos } from "@/hooks/use-analytics";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useSettings } from "@/lib/settings";
import { computeDora, doraRating, leaderboard, pipelineStats } from "@/lib/metrics";
import { GitCommit, GitPullRequest, AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/projects/$id")({ component: ProjectDetail });

function ProjectDetail() {
  const { id } = Route.useParams();
  const repo = decodeURIComponent(id);
  const { token } = useSettings();
  const repos = useRepos();
  const commits = useRepoCommits(repo, 90);
  const issues = useRepoIssues(repo);
  const pipes = useRepoPipelines(repo);

  if (!token) return <NoToken />;
  const meta = repos.data?.find((r) => r.fullName === repo);
  const dates = (commits.data ?? []).map((c) => c.date);
  const ps = pipelineStats(pipes.data ?? []);
  const dora = computeDora(pipes.data ?? [], issues.data ?? [], 30);
  const r = doraRating(dora);
  const top = leaderboard(commits.data ?? []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">Project</div>
        <h1 className="text-2xl font-bold tracking-tight break-all">{repo}</h1>
        {meta?.description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{meta.description}</p>}
      </div>

      {(commits.error || pipes.error || issues.error) && (
        <ErrorState message={((commits.error || pipes.error || issues.error) as Error).message} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Commits (90d)" value={commits.data?.length ?? "—"} icon={GitCommit} />
        <KpiCard label="Open issues" value={(issues.data ?? []).filter((i) => !i.isPR && i.state === "open").length} icon={AlertCircle} />
        <KpiCard label="Open PRs/MRs" value={(issues.data ?? []).filter((i) => i.isPR && i.state === "open").length} icon={GitPullRequest} />
        <KpiCard label="Pipelines" value={ps.total} icon={Zap} hint={`${ps.successRate.toFixed(0)}% success`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur glow">
          <h3 className="text-sm font-semibold mb-3">Commit velocity · 30d</h3>
          <CommitChart dates={dates} days={30} />
        </Card>
        <Card className="p-5 bg-card/60 backdrop-blur glow">
          <h3 className="text-sm font-semibold mb-3">DORA · 30d</h3>
          <ul className="space-y-3 text-sm">
            <DoraRow label="Deployment frequency" value={`${dora.deploymentFrequency.toFixed(2)}/day`} rating={r.df} />
            <DoraRow label="Lead time for changes" value={`${dora.leadTimeHours.toFixed(1)}h`} rating={r.lt} />
            <DoraRow label="Change failure rate" value={`${dora.changeFailureRate.toFixed(1)}%`} rating={r.cfr} />
            <DoraRow label="MTTR" value={`${dora.mttrHours.toFixed(1)}h`} rating={r.mttr} />
          </ul>
        </Card>
      </div>

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <h3 className="text-sm font-semibold mb-3">Heatmap · 6 months</h3>
        <Heatmap dates={dates} weeks={26} />
      </Card>

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <h3 className="text-sm font-semibold mb-3">Top contributors</h3>
        <ol className="grid sm:grid-cols-2 gap-2">
          {top.map((t, i) => (
            <li key={t.author} className="flex items-center gap-3 text-sm py-1">
              <span className="size-6 grid place-items-center rounded-md bg-muted text-[10px]">{i + 1}</span>
              <span className="truncate flex-1">{t.author}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{t.count}</span>
            </li>
          ))}
          {top.length === 0 && <li className="text-xs text-muted-foreground">No commits in the window.</li>}
        </ol>
      </Card>
    </div>
  );
}

function DoraRow({ label, value, rating }: { label: string; value: string; rating: string }) {
  const color =
    rating === "Elite" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
    rating === "High" ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" :
    rating === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
    "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted-foreground text-xs flex-1">{label}</span>
      <span className="tabular-nums">{value}</span>
      <Badge variant="outline" className={"text-[10px] border " + color}>{rating}</Badge>
    </li>
  );
}