import { U as reactExports, L as jsxRuntimeExports } from "./server-BXNvyGht.js";
import { d as cn, x as useSettings, w as useRepos, L as Link, B as Button } from "./router-BawXN-e9.js";
import { C as Card } from "./card-DaI94CNE.js";
import { I as Input } from "./input-DtxZy8yt.js";
import { B as Badge } from "./badge-ea-EWPqz.js";
import { N as NoToken, E as ErrorState } from "./empty-state-CV--Y4Gi.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function ProjectsPage() {
  const {
    token
  } = useSettings();
  const repos = useRepos();
  const [q, setQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const pageSize = 20;
  const filtered = reactExports.useMemo(() => {
    const list = repos.data ?? [];
    if (!q) return list;
    const ql = q.toLowerCase();
    return list.filter((r) => r.fullName.toLowerCase().includes(ql) || (r.description ?? "").toLowerCase().includes(ql) || (r.language ?? "").toLowerCase().includes(ql));
  }, [repos.data, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
  if (!token) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoToken, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          repos.data?.length ?? 0,
          " repositories"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => {
        setPage(0);
        setQ(e.target.value);
      }, placeholder: "Filter by name, language…", className: "max-w-xs" })
    ] }),
    repos.error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: repos.error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/60 backdrop-blur glow overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Language" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Stars" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Forks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Updated" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          slice.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id", params: {
                id: encodeURIComponent(r.fullName)
              }, className: "font-medium hover:text-primary", children: r.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground line-clamp-1", children: r.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: r.language ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: r.language }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: r.stars }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: r.forks }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: r.openIssues }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-xs text-muted-foreground", children: new Date(r.updatedAt).toLocaleDateString() })
          ] }, r.id)),
          !slice.length && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-sm text-muted-foreground py-10", children: repos.isLoading ? "Loading…" : "No projects" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border-t border-border text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "Page ",
          page + 1,
          " of ",
          pages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: page === 0, onClick: () => setPage((p) => p - 1), children: "Prev" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: page >= pages - 1, onClick: () => setPage((p) => p + 1), children: "Next" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProjectsPage as component
};
