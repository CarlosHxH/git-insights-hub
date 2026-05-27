import { L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { C as Card } from "./card-DaI94CNE.js";
function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden p-5 bg-card/60 backdrop-blur border-border glow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-primary/80" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-3xl font-bold tracking-tight tabular-nums", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2 text-xs", children: [
      delta && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: delta.positive ?? delta.value >= 0 ? "text-emerald-400" : "text-rose-400", children: [
        delta.value >= 0 ? "+" : "",
        delta.value,
        "%"
      ] }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: hint })
    ] })
  ] });
}
export {
  KpiCard as K
};
