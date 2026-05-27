import { U as reactExports, L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { C as Card } from "./card-DaI94CNE.js";
import { C as CommitChart, H as Heatmap } from "./heatmap-D4ZTtG8X.js";
import { N as NoToken, E as ErrorState } from "./empty-state-CV--Y4Gi.js";
import { x as useSettings, w as useRepos, u as useAggregateCommits } from "./router-BawXN-e9.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ActivityPage() {
  const {
    token
  } = useSettings();
  const repos = useRepos();
  const commits = useAggregateCommits(repos.data, 90, 10);
  const [visible, setVisible] = reactExports.useState(50);
  const sorted = reactExports.useMemo(() => (commits.data ?? []).slice().sort((a, b) => +new Date(b.date) - +new Date(a.date)), [commits.data]);
  if (!token) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoToken, {});
  const dates = (commits.data ?? []).map((c) => c.date);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Timeline & heatmap across your projects" })
    ] }),
    commits.error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: commits.error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Velocity · 30d" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommitChart, { dates, days: 30 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Heatmap · 6 months" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heatmap, { dates, weeks: 26 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/60 backdrop-blur glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          sorted.length,
          " commits"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onScroll: (e) => {
        const el = e.currentTarget;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 200 && visible < sorted.length) {
          setVisible((v) => Math.min(v + 50, sorted.length));
        }
      }, className: "max-h-[600px] overflow-y-auto divide-y divide-border", children: [
        sorted.slice(0, visible).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.url, target: "_blank", rel: "noreferrer", className: "flex items-start gap-4 px-5 py-3 hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] tabular-nums text-muted-foreground w-24 pt-0.5", children: new Date(c.date).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate", children: c.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
              c.author,
              " · ",
              c.repo
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px] text-muted-foreground hidden sm:inline", children: c.sha.slice(0, 7) })
        ] }, c.sha + c.repo)),
        !sorted.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: commits.isLoading ? "Loading commits…" : "No commits in the window" })
      ] })
    ] })
  ] });
}
export {
  ActivityPage as component
};
