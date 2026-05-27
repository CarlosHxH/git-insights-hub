import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CommitChart } from "@/components/commit-chart";
import { Heatmap } from "@/components/heatmap";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useAggregateCommits, useRepos } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/activity")({ component: ActivityPage });

function ActivityPage() {
  const { token } = useSettings();
  const repos = useRepos();
  const commits = useAggregateCommits(repos.data, 90, 10);
  const [visible, setVisible] = useState(50);

  const sorted = useMemo(
    () => (commits.data ?? []).slice().sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [commits.data],
  );

  if (!token) return <NoToken />;
  const dates = (commits.data ?? []).map((c) => c.date);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">Timeline & heatmap across your projects</p>
      </div>
      {commits.error && <ErrorState message={(commits.error as Error).message} />}

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <h3 className="text-sm font-semibold mb-3">Velocity · 30d</h3>
        <CommitChart dates={dates} days={30} />
      </Card>

      <Card className="p-5 bg-card/60 backdrop-blur glow">
        <h3 className="text-sm font-semibold mb-3">Heatmap · 6 months</h3>
        <Heatmap dates={dates} weeks={26} />
      </Card>

      <Card className="bg-card/60 backdrop-blur glow">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Timeline</h3>
          <span className="text-xs text-muted-foreground">{sorted.length} commits</span>
        </div>
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 200 && visible < sorted.length) {
              setVisible((v) => Math.min(v + 50, sorted.length));
            }
          }}
          className="max-h-[600px] overflow-y-auto divide-y divide-border"
        >
          {sorted.slice(0, visible).map((c) => (
            <a key={c.sha + c.repo} href={c.url} target="_blank" rel="noreferrer"
              className="flex items-start gap-4 px-5 py-3 hover:bg-muted/30">
              <div className="text-[10px] tabular-nums text-muted-foreground w-24 pt-0.5">
                {new Date(c.date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{c.message}</div>
                <div className="text-xs text-muted-foreground truncate">{c.author} · {c.repo}</div>
              </div>
              <code className="text-[10px] text-muted-foreground hidden sm:inline">{c.sha.slice(0, 7)}</code>
            </a>
          ))}
          {!sorted.length && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              {commits.isLoading ? "Loading commits…" : "No commits in the window"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}