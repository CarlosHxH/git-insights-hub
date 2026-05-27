function leaderboard(commits) {
  const m = /* @__PURE__ */ new Map();
  for (const c of commits) m.set(c.author, (m.get(c.author) ?? 0) + 1);
  return Array.from(m, ([author, count]) => ({ author, count })).sort((a, b) => b.count - a.count);
}
function pipelineStats(pipes) {
  const total = pipes.length;
  const success = pipes.filter((p) => p.status === "success").length;
  const failed = pipes.filter((p) => p.status === "failed").length;
  const avg = (() => {
    const d = pipes.map((p) => p.durationSec ?? 0).filter((x) => x > 0);
    if (!d.length) return 0;
    return Math.round(d.reduce((a, b) => a + b, 0) / d.length);
  })();
  return { total, success, failed, successRate: total ? success / total * 100 : 0, avgDuration: avg };
}
function median(xs) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function computeDora(pipes, issues, days = 30) {
  const ms = days * 864e5;
  const cutoff = Date.now() - ms;
  const recentPipes = pipes.filter((p) => +new Date(p.startedAt) >= cutoff);
  const successes = recentPipes.filter((p) => p.status === "success");
  const failed = recentPipes.filter((p) => p.status === "failed").length;
  const deploymentFrequency = successes.length / days;
  const changeFailureRate = recentPipes.length ? failed / recentPipes.length * 100 : 0;
  const byRef = /* @__PURE__ */ new Map();
  for (const p of [...recentPipes].sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt))) {
    const arr = byRef.get(p.ref) ?? [];
    arr.push(p);
    byRef.set(p.ref, arr);
  }
  const recoveries = [];
  for (const arr of byRef.values()) {
    let failedAt = null;
    for (const p of arr) {
      if (p.status === "failed" && failedAt === null) failedAt = +new Date(p.startedAt);
      else if (p.status === "success" && failedAt !== null) {
        recoveries.push((+new Date(p.startedAt) - failedAt) / 36e5);
        failedAt = null;
      }
    }
  }
  const mttrHours = recoveries.length ? recoveries.reduce((a, b) => a + b, 0) / recoveries.length : 0;
  const merged = issues.filter((i) => i.isPR && i.mergedAt && +new Date(i.mergedAt) >= cutoff);
  const leadTimeHours = median(
    merged.map((m) => (+new Date(m.mergedAt) - +new Date(m.createdAt)) / 36e5)
  );
  return { deploymentFrequency, leadTimeHours, changeFailureRate, mttrHours };
}
function doraRating(d) {
  const df = d.deploymentFrequency >= 1 ? "Elite" : d.deploymentFrequency >= 1 / 7 ? "High" : d.deploymentFrequency >= 1 / 30 ? "Medium" : "Low";
  const lt = d.leadTimeHours <= 24 ? "Elite" : d.leadTimeHours <= 24 * 7 ? "High" : d.leadTimeHours <= 24 * 30 ? "Medium" : "Low";
  const cfr = d.changeFailureRate <= 15 ? "Elite" : d.changeFailureRate <= 30 ? "High" : d.changeFailureRate <= 45 ? "Medium" : "Low";
  const mttr = d.mttrHours <= 1 ? "Elite" : d.mttrHours <= 24 ? "High" : d.mttrHours <= 24 * 7 ? "Medium" : "Low";
  return { df, lt, cfr, mttr };
}
export {
  computeDora as c,
  doraRating as d,
  leaderboard as l,
  pipelineStats as p
};
