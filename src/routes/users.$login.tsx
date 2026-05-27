import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  MapPin, Building2, Link2, Users, GitBranch, Star, GitFork,
  CalendarDays, ExternalLink, ArrowLeft, Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NoToken, ErrorState } from "@/components/empty-state";
import { useUserProfile, useUserRepos, useUserActivity } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";
import { CommitChart } from "@/components/commit-chart";

export const Route = createFileRoute("/users/$login")({ component: UserProfilePage });

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center px-4 py-2 rounded-lg bg-muted/50">
      <span className="text-lg font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function eventIcon(type: string) {
  if (type.includes("Push") || type === "pushed") return "⬆";
  if (type.includes("PullRequest") || type === "accepted") return "⤵";
  if (type.includes("Issue") || type === "opened") return "◉";
  if (type.includes("Fork") || type === "forked") return "⑂";
  if (type.includes("Watch") || type === "starred") return "★";
  if (type.includes("Create")) return "✦";
  if (type.includes("Delete")) return "✕";
  return "•";
}

function UserProfilePage() {
  const { login } = Route.useParams();
  const { token } = useSettings();

  const profile = useUserProfile(login);
  const repos = useUserRepos(login);
  const activity = useUserActivity(login);

  const topRepos = useMemo(
    () => (repos.data ?? []).sort((a, b) => b.stars - a.stars).slice(0, 6),
    [repos.data],
  );

  const langMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of repos.data ?? []) {
      if (r.language) map[r.language] = (map[r.language] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [repos.data]);

  const activityDates = useMemo(
    () => (activity.data ?? []).map((e) => e.date),
    [activity.data],
  );

  if (!token) return <NoToken />;

  if (profile.error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState message={(profile.error as Error).message} />
      </div>
    );
  }

  const u = profile.data;

  return (
    <div className="space-y-6">
      <BackLink />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {u ? (
          <>
            <Avatar className="size-20 border-2 border-border shrink-0">
              <AvatarImage src={u.avatar} />
              <AvatarFallback className="text-2xl">{u.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{u.name ?? u.login}</h1>
                <Badge variant="secondary">@{u.login}</Badge>
                <a href={u.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground ml-auto">
                  <ExternalLink className="size-4" />
                </a>
              </div>
              {u.bio && <p className="text-sm text-muted-foreground mt-1">{u.bio}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                {u.company && (
                  <span className="flex items-center gap-1"><Building2 className="size-3" />{u.company}</span>
                )}
                {u.location && (
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{u.location}</span>
                )}
                {u.blog && (
                  <a href={u.blog.startsWith("http") ? u.blog : `https://${u.blog}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground">
                    <Link2 className="size-3" />{u.blog}
                  </a>
                )}
                <span className="flex items-center gap-1"><CalendarDays className="size-3" />Joined {new Date(u.createdAt).getFullYear()}</span>
              </div>
              <div className="flex gap-3 mt-3">
                <StatPill label="Repos" value={u.publicRepos} />
                <StatPill label="Followers" value={u.followers} />
                <StatPill label="Following" value={u.following} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-5 animate-pulse">
            <div className="size-20 rounded-full bg-muted/50" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-48 rounded bg-muted/50" />
              <div className="h-4 w-64 rounded bg-muted/50" />
              <div className="h-4 w-32 rounded bg-muted/50" />
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="repos">
        <TabsList>
          <TabsTrigger value="repos"><GitBranch className="size-3.5 mr-1.5" />Repositories</TabsTrigger>
          <TabsTrigger value="activity"><Activity className="size-3.5 mr-1.5" />Activity</TabsTrigger>
          <TabsTrigger value="stats"><Star className="size-3.5 mr-1.5" />Stats</TabsTrigger>
        </TabsList>

        {/* Repositories tab */}
        <TabsContent value="repos" className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {topRepos.map((r) => (
              <Link
                key={r.id}
                to="/projects/$id"
                params={{ id: encodeURIComponent(r.fullName) }}
              >
                <Card className="p-4 bg-card/60 backdrop-blur glow flex flex-col gap-2 h-full hover:border-primary/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold truncate">{r.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{r.visibility}</span>
                  </div>
                  {r.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{r.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {r.language && <Badge variant="secondary" className="text-[10px] py-0">{r.language}</Badge>}
                    <span className="flex items-center gap-1"><Star className="size-3" />{r.stars.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><GitFork className="size-3" />{r.forks.toLocaleString()}</span>
                  </div>
                </Card>
              </Link>
            ))}
            {repos.isLoading && (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-muted/30 animate-pulse" />
              ))
            )}
            {!repos.isLoading && repos.data?.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full">No public repositories.</p>
            )}
          </div>
          {(repos.data?.length ?? 0) > 6 && (
            <p className="text-xs text-muted-foreground text-center">Showing top 6 by stars · {repos.data!.length} total</p>
          )}
        </TabsContent>

        {/* Activity tab */}
        <TabsContent value="activity" className="mt-4 space-y-4">
          <Card className="p-5 bg-card/60 backdrop-blur glow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Activity heatmap</h3>
              <span className="text-xs text-muted-foreground">recent events</span>
            </div>
            {activity.isLoading ? (
              <div className="h-28 animate-pulse rounded-md bg-muted/50" />
            ) : (
              <CommitChart dates={activityDates} days={30} />
            )}
          </Card>

          <Card className="bg-card/60 backdrop-blur glow divide-y divide-border">
            {activity.isLoading && (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
                  <div className="size-6 rounded-full bg-muted/50 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-muted/50" />
                    <div className="h-3 w-1/3 rounded bg-muted/50" />
                  </div>
                </div>
              ))
            )}
            {(activity.data ?? []).slice(0, 30).map((e) => (
              <div key={e.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                <span className="size-6 grid place-items-center rounded-md bg-muted text-xs shrink-0 mt-0.5">
                  {eventIcon(e.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{e.summary}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.repo}</p>
                </div>
                <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {new Date(e.date).toLocaleDateString()}
                </time>
              </div>
            ))}
            {!activity.isLoading && activity.data?.length === 0 && (
              <p className="text-sm text-muted-foreground px-4 py-6">No recent activity.</p>
            )}
          </Card>
        </TabsContent>

        {/* Stats tab */}
        <TabsContent value="stats" className="mt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 bg-card/60 backdrop-blur glow">
              <h3 className="text-sm font-semibold mb-3">Top languages</h3>
              {langMap.length === 0 && !repos.isLoading && (
                <p className="text-xs text-muted-foreground">No language data.</p>
              )}
              <div className="space-y-2">
                {langMap.map(([lang, count]) => (
                  <div key={lang} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 truncate">{lang}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                    <div className="h-1.5 w-28 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                        style={{ width: `${(count / langMap[0][1]) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-card/60 backdrop-blur glow">
              <h3 className="text-sm font-semibold mb-3">Repository stats</h3>
              {repos.data ? (
                <div className="space-y-3">
                  <StatRow label="Total stars" value={(repos.data.reduce((a, r) => a + r.stars, 0)).toLocaleString()} />
                  <StatRow label="Total forks" value={(repos.data.reduce((a, r) => a + r.forks, 0)).toLocaleString()} />
                  <StatRow label="Open issues" value={(repos.data.reduce((a, r) => a + r.openIssues, 0)).toLocaleString()} />
                  <StatRow label="Public repos" value={repos.data.length} />
                  <StatRow
                    label="Most starred"
                    value={repos.data.sort((a, b) => b.stars - a.stars)[0]?.name ?? "—"}
                  />
                </div>
              ) : (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-muted/50" />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-5 bg-card/60 backdrop-blur glow">
            <h3 className="text-sm font-semibold mb-3">Activity chart · last 30 days</h3>
            {activity.isLoading ? (
              <div className="h-40 animate-pulse rounded-md bg-muted/50" />
            ) : (
              <CommitChart dates={activityDates} days={30} />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/users" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit">
      <ArrowLeft className="size-3.5" />
      Users
    </Link>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
