import { L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { g as createLucideIcon, L as Link } from "./router-BawXN-e9.js";
import { C as Card } from "./card-DaI94CNE.js";
const __iconNode = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode);
function NoToken() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center max-w-xl mx-auto bg-card/60 backdrop-blur glow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-12 rounded-xl bg-primary/15 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-lg font-semibold", children: "Connect your account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Add a personal access token in Settings to start pulling data from GitHub or GitLab." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/settings",
        className: "mt-5 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90",
        children: "Open settings"
      }
    )
  ] });
}
function ErrorState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 border-destructive/40 bg-destructive/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive break-words", children: message }) });
}
export {
  ErrorState as E,
  NoToken as N
};
