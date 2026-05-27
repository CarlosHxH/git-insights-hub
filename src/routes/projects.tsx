import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useRepos } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

function ProjectsPage() {
  const { token } = useSettings();
  const repos = useRepos();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const filtered = useMemo(() => {
    const list = repos.data ?? [];
    if (!q) return list;
    const ql = q.toLowerCase();
    return list.filter(
      (r) =>
        r.fullName.toLowerCase().includes(ql) ||
        (r.description ?? "").toLowerCase().includes(ql) ||
        (r.language ?? "").toLowerCase().includes(ql),
    );
  }, [repos.data, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (!token) return <NoToken />;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">{repos.data?.length ?? 0} repositories</p>
        </div>
        <Input
          value={q}
          onChange={(e) => { setPage(0); setQ(e.target.value); }}
          placeholder="Filter by name, language…"
          className="max-w-xs"
        />
      </div>

      {repos.error && <ErrorState message={(repos.error as Error).message} />}

      <Card className="bg-card/60 backdrop-blur glow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Language</TableHead>
              <TableHead className="text-right">Stars</TableHead>
              <TableHead className="text-right">Forks</TableHead>
              <TableHead className="text-right">Issues</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30">
                <TableCell>
                  <Link
                    to="/projects/$id"
                    params={{ id: encodeURIComponent(r.fullName) }}
                    className="font-medium hover:text-primary"
                  >
                    {r.fullName}
                  </Link>
                  <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {r.language ? <Badge variant="secondary">{r.language}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                </TableCell>
                <TableCell className="text-right tabular-nums">{r.stars}</TableCell>
                <TableCell className="text-right tabular-nums">{r.forks}</TableCell>
                <TableCell className="text-right tabular-nums">{r.openIssues}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                  {new Date(r.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!slice.length && (
              <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                {repos.isLoading ? "Loading…" : "No projects"}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-3 border-t border-border text-xs">
          <span className="text-muted-foreground">Page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}