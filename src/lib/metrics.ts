import type { Commit, Issue, Pipeline } from "./api";

export function leaderboard(commits: Commit[]) {
  const m = new Map<string, number>();
  for (const c of commits) m.set(c.author, (m.get(c.author) ?? 0) + 1);
  return Array.from(m, ([author, count]) => ({ author, count })).sort((a, b) => b.count - a.count);
}

export function pipelineStats(pipes: Pipeline[]) {
  const total = pipes.length;
  const success = pipes.filter((p) => p.status === "success").length;
  const failed = pipes.filter((p) => p.status === "failed").length;
  const avg = (() => {
    const d = pipes.map((p) => p.durationSec ?? 0).filter((x) => x > 0);
    if (!d.length) return 0;
    return Math.round(d.reduce((a, b) => a + b, 0) / d.length);
  })();
  return { total, success, failed, successRate: total ? (success / total) * 100 : 0, avgDuration: avg };
}

/* ---- DORA --------------------------------------------------------------- */

export type Dora = {
  deploymentFrequency: number; // deploys / day
  leadTimeHours: number;       // PR open->merge median
  changeFailureRate: number;   // %
  mttrHours: number;           // mean time to recover (failed -> next success)
};

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function computeDora(pipes: Pipeline[], issues: Issue[], days = 30): Dora {
  const ms = days * 86400_000;
  const cutoff = Date.now() - ms;
  const recentPipes = pipes.filter((p) => +new Date(p.startedAt) >= cutoff);
  const successes = recentPipes.filter((p) => p.status === "success");
  const failed = recentPipes.filter((p) => p.status === "failed").length;
  const deploymentFrequency = successes.length / days;
  const changeFailureRate = recentPipes.length ? (failed / recentPipes.length) * 100 : 0;

  // MTTR: each failed run -> time until next success on same ref
  const byRef = new Map<string, Pipeline[]>();
  for (const p of [...recentPipes].sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt))) {
    const arr = byRef.get(p.ref) ?? [];
    arr.push(p);
    byRef.set(p.ref, arr);
  }
  const recoveries: number[] = [];
  for (const arr of byRef.values()) {
    let failedAt: number | null = null;
    for (const p of arr) {
      if (p.status === "failed" && failedAt === null) failedAt = +new Date(p.startedAt);
      else if (p.status === "success" && failedAt !== null) {
        recoveries.push((+new Date(p.startedAt) - failedAt) / 3600_000);
        failedAt = null;
      }
    }
  }
  const mttrHours = recoveries.length ? recoveries.reduce((a, b) => a + b, 0) / recoveries.length : 0;

  // Lead time: PRs/MRs merged in window
  const merged = issues.filter((i) => i.isPR && i.mergedAt && +new Date(i.mergedAt) >= cutoff);
  const leadTimeHours = median(
    merged.map((m) => (+new Date(m.mergedAt!) - +new Date(m.createdAt)) / 3600_000),
  );

  return { deploymentFrequency, leadTimeHours, changeFailureRate, mttrHours };
}

export function doraRating(d: Dora) {
  // Simplified mapping per DORA report.
  const df =
    d.deploymentFrequency >= 1 ? "Elite" :
    d.deploymentFrequency >= 1 / 7 ? "High" :
    d.deploymentFrequency >= 1 / 30 ? "Medium" : "Low";
  const lt =
    d.leadTimeHours <= 24 ? "Elite" :
    d.leadTimeHours <= 24 * 7 ? "High" :
    d.leadTimeHours <= 24 * 30 ? "Medium" : "Low";
  const cfr =
    d.changeFailureRate <= 15 ? "Elite" :
    d.changeFailureRate <= 30 ? "High" :
    d.changeFailureRate <= 45 ? "Medium" : "Low";
  const mttr =
    d.mttrHours <= 1 ? "Elite" :
    d.mttrHours <= 24 ? "High" :
    d.mttrHours <= 24 * 7 ? "Medium" : "Low";
  return { df, lt, cfr, mttr };
}