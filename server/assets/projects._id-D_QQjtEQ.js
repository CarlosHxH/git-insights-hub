import { L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { C as Card } from "./card-DaI94CNE.js";
import { K as KpiCard } from "./kpi-card-BpHvtxvs.js";
import { C as CommitChart, H as Heatmap } from "./heatmap-D4ZTtG8X.js";
import { g as createLucideIcon, R as Route, x as useSettings, w as useRepos, p as useRepoCommits, q as useRepoIssues, v as useRepoPipelines, Z as Zap } from "./router-BawXN-e9.js";
import { N as NoToken, E as ErrorState } from "./empty-state-CV--Y4Gi.js";
import { p as pipelineStats, c as computeDora, l as leaderboard, d as doraRating } from "./metrics-YhbiggJx.js";
import { B as Badge } from "./badge-ea-EWPqz.js";
import { G as GitCommitHorizontal } from "./git-commit-horizontal-BjeXrjPv.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "18", cy: "18", r: "3", key: "1xkwt0" }],
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7", key: "1yeb86" }],
  ["line", { x1: "6", x2: "6", y1: "9", y2: "21", key: "rroup" }]
];
const GitPullRequest = createLucideIcon("git-pull-request", __iconNode);
function ProjectDetail() {
  const {
    id
  } = Route.useParams();
  const repo = decodeURIComponent(id);
  const {
    token
  } = useSettings();
  const repos = useRepos();
  const commits = useRepoCommits(repo, 90);
  const issues = useRepoIssues(repo);
  const pipes = useRepoPipelines(repo);
  if (!token) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoToken, {});
  const meta = repos.data?.find((r2) => r2.fullName === repo);
  const dates = (commits.data ?? []).map((c) => c.date);
  const ps = pipelineStats(pipes.data ?? []);
  const dora = computeDora(pipes.data ?? [], issues.data ?? [], 30);
  const r = doraRating(dora);
  const top = leaderboard(commits.data ?? []).slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Project" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight break-all", children: repo }),
      meta?.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-2xl", children: meta.description })
    ] }),
    (commits.error || pipes.error || issues.error) && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: (commits.error || pipes.error || issues.error).message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Commits (90d)", value: commits.data?.length ?? "—", icon: GitCommitHorizontal }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Open issues", value: (issues.data ?? []).filter((i) => !i.isPR && i.state === "open").length, icon: CircleAlert }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Open PRs/MRs", value: (issues.data ?? []).filter((i) => i.isPR && i.state === "open").length, icon: GitPullRequest }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pipelines", value: ps.total, icon: Zap, hint: `${ps.successRate.toFixed(0)}% success` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 p-5 bg-card/60 backdrop-blur glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Commit velocity · 30d" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommitChart, { dates, days: 30 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "DORA · 30d" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DoraRow, { label: "Deployment frequency", value: `${dora.deploymentFrequency.toFixed(2)}/day`, rating: r.df }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DoraRow, { label: "Lead time for changes", value: `${dora.leadTimeHours.toFixed(1)}h`, rating: r.lt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DoraRow, { label: "Change failure rate", value: `${dora.changeFailureRate.toFixed(1)}%`, rating: r.cfr }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DoraRow, { label: "MTTR", value: `${dora.mttrHours.toFixed(1)}h`, rating: r.mttr })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Heatmap · 6 months" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heatmap, { dates, weeks: 26 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Top contributors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "grid sm:grid-cols-2 gap-2", children: [
        top.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-sm py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 grid place-items-center rounded-md bg-muted text-[10px]", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", children: t.author }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: t.count })
        ] }, t.author)),
        top.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-muted-foreground", children: "No commits in the window." })
      ] })
    ] })
  ] });
}
function DoraRow({
  label,
  value,
  rating
}) {
  const color = rating === "Elite" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : rating === "High" ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : rating === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs flex-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border " + color, children: rating })
  ] });
}
export {
  ProjectDetail as component
};
