import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useAggregatePipelines, useRepos } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import { pipelineStats } from "@/lib/metrics";
import { Zap, CheckCircle2, XCircle, Timer } from "lucide-react";

export const Route = createFileRoute("/pipelines")({ component: PipelinesPage });

const COLORS: Record<string, string> = {
  success: "bg-emerald-400", failed: "bg-rose-400", running: "bg-cyan-400",
  pending: "bg-amber-400", canceled: "bg-slate-400", unknown: "bg-slate-500",
};

function PipelinesPage() {
  const { token } = useSettings();
  const repos = useRepos();
  const pipes = useAggregatePipelines(repos.data, 10);
  const ps = pipelineStats(pipes.data ?? []);
  if (!token) return <NoToken />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CI / CD Pipelines</h1>
        <p className="text-sm text-muted-foreground">Aggregated across projects</p>
      </div>
      {pipes.error && <ErrorState message={(pipes.error as Error).message} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total runs" value={ps.total} icon={Zap} />
        <KpiCard label="Success rate" value={`${ps.successRate.toFixed(1)}%`} icon={CheckCircle2} />
        <KpiCard label="Failures" value={ps.failed} icon={XCircle} />
        <KpiCard label="Avg duration" value={`${Math.round(ps.avgDuration / 60)}m`} icon={Timer} />
      </div>

      <Card className="bg-card/60 backdrop-blur glow">
        <div className="p-5 border-b border-border text-sm font-semibold">Recent runs</div>
        <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
          {(pipes.data ?? [])
            .slice()
            .sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt))
            .slice(0, 100)
            .map((p) => (
              <a key={p.id + p.repo} href={p.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-muted/30 text-sm">
                <span className={"size-2 rounded-full " + (COLORS[p.status] ?? COLORS.unknown)} />
                <span className="capitalize w-20 text-xs">{p.status}</span>
                <span className="truncate flex-1">{p.repo}</span>
                <code className="text-xs text-muted-foreground hidden md:inline truncate max-w-[200px]">{p.ref}</code>
                <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">
                  {p.durationSec ? `${Math.round(p.durationSec / 60)}m` : "—"}
                </span>
              </a>
            ))}
          {!pipes.data?.length && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              {pipes.isLoading ? "Loading…" : "No pipelines found"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}