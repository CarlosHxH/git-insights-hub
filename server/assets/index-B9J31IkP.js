import { L as jsxRuntimeExports, U as reactExports } from "./server-BXNvyGht.js";
import { K as KpiCard } from "./kpi-card-BpHvtxvs.js";
import { C as Card } from "./card-DaI94CNE.js";
import { C as CommitChart, H as Heatmap } from "./heatmap-D4ZTtG8X.js";
import { N as NoToken, E as ErrorState } from "./empty-state-CV--Y4Gi.js";
import { g as createLucideIcon, x as useSettings, w as useRepos, o as useMembers, u as useAggregateCommits, j as useAggregatePipelines, G as GitBranch, U as Users, Z as Zap, A as Activity, L as Link } from "./router-BawXN-e9.js";
import { l as leaderboard, p as pipelineStats } from "./metrics-YhbiggJx.js";
import { G as GitCommitHorizontal } from "./git-commit-horizontal-BjeXrjPv.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function Index() {
  const {
    token
  } = useSettings();
  const repos = useRepos();
  const members = useMembers();
  const commits = useAggregateCommits(repos.data, 30, 10);
  const pipes = useAggregatePipelines(repos.data, 10);
  if (!token) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoToken, {});
  const totalStars = (repos.data ?? []).reduce((a, b) => a + b.stars, 0);
  const totalIssues = (repos.data ?? []).reduce((a, b) => a + b.openIssues, 0);
  const dates = (commits.data ?? []).map((c) => c.date);
  const top = reactExports.useMemo(() => leaderboard(commits.data ?? []).slice(0, 6), [commits.data]);
  const ps = pipelineStats(pipes.data ?? []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline justify-between gap-4 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Live engineering signals across your projects · last 30 days" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Projects", value: repos.data?.length ?? "—", icon: GitBranch, hint: "repositories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "People", value: members.data?.length ?? "—", icon: Users, hint: "members" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Commits", value: commits.data?.length ?? "—", icon: GitCommitHorizontal, hint: "30d" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pipelines", value: ps.total, icon: Zap, hint: `${ps.successRate.toFixed(0)}% green` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Open issues", value: totalIssues, icon: Activity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total stars", value: totalStars, icon: Star })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 p-5 bg-card/60 backdrop-blur glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Commit velocity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "last 30 days" })
        ] }),
        commits.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skel, { h: 220 }) : commits.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: commits.error.message }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CommitChart, { dates, days: 30 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Top contributors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2", children: [
          top.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-muted-foreground", children: "No commits yet." }),
          top.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 grid place-items-center rounded-md bg-muted text-[10px] tabular-nums", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", children: t.author }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: t.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-20 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-cyan-400 to-violet-500", style: {
              width: `${t.count / top[0].count * 100}%`
            } }) })
          ] }, t.author))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Activity heatmap" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "~6 months · aggregated" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heatmap, { dates, weeks: 26 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Recent projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects", className: "text-xs text-primary hover:underline", children: "View all →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: (repos.data ?? []).slice(0, 6).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/projects/$id", params: {
        id: encodeURIComponent(r.fullName)
      }, className: "rounded-lg border border-border bg-background/40 p-4 hover:border-primary/60 transition-colors block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: r.visibility })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-1", children: r.description || "No description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "★ ",
            r.stars
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "⑂ ",
            r.forks
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "● ",
            r.openIssues
          ] })
        ] })
      ] }, r.id)) })
    ] })
  ] });
}
function Skel({
  h
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse rounded-md bg-muted/50", style: {
    height: h
  } });
}
export {
  Index as component
};
