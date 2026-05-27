import { L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { C as Card } from "./card-DaI94CNE.js";
import { K as KpiCard } from "./kpi-card-BpHvtxvs.js";
import { N as NoToken, E as ErrorState } from "./empty-state-CV--Y4Gi.js";
import { g as createLucideIcon, x as useSettings, w as useRepos, j as useAggregatePipelines, Z as Zap } from "./router-BawXN-e9.js";
import { p as pipelineStats } from "./metrics-YhbiggJx.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
const COLORS = {
  success: "bg-emerald-400",
  failed: "bg-rose-400",
  running: "bg-cyan-400",
  pending: "bg-amber-400",
  canceled: "bg-slate-400",
  unknown: "bg-slate-500"
};
function PipelinesPage() {
  const {
    token
  } = useSettings();
  const repos = useRepos();
  const pipes = useAggregatePipelines(repos.data, 10);
  const ps = pipelineStats(pipes.data ?? []);
  if (!token) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoToken, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "CI / CD Pipelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aggregated across projects" })
    ] }),
    pipes.error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: pipes.error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total runs", value: ps.total, icon: Zap }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Success rate", value: `${ps.successRate.toFixed(1)}%`, icon: CircleCheck }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Failures", value: ps.failed, icon: CircleX }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Avg duration", value: `${Math.round(ps.avgDuration / 60)}m`, icon: Timer })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border text-sm font-semibold", children: "Recent runs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[600px] overflow-y-auto divide-y divide-border", children: [
        (pipes.data ?? []).slice().sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt)).slice(0, 100).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: p.url, target: "_blank", rel: "noreferrer", className: "flex items-center gap-3 px-5 py-2.5 hover:bg-muted/30 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full " + (COLORS[p.status] ?? COLORS.unknown) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize w-20 text-xs", children: p.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", children: p.repo }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs text-muted-foreground hidden md:inline truncate max-w-[200px]", children: p.ref }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums w-16 text-right", children: p.durationSec ? `${Math.round(p.durationSec / 60)}m` : "—" })
        ] }, p.id + p.repo)),
        !pipes.data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: pipes.isLoading ? "Loading…" : "No pipelines found" })
      ] })
    ] })
  ] });
}
export {
  PipelinesPage as component
};
