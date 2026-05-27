import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, GitBranch, Users, Star, GitFork, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { NoToken } from "@/components/empty-state";
import { useSearchRepos, useSearchUsers } from "@/hooks/use-analytics";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/explore")({ component: ExplorePage });

function useDebounce(value: string, ms = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return deb;
}

function ExplorePage() {
  const { token, provider } = useSettings();
  const [raw, setRaw] = useState("");
  const q = useDebounce(raw);

  const repos = useSearchRepos(q);
  const users = useSearchUsers(q);

  if (!token) return <NoToken />;

  const providerLabel = provider === "github" ? "GitHub" : "GitLab";
  const isLoading = repos.isFetching || users.isFetching;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Search public repositories and users across all of {providerLabel}
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={`Search ${providerLabel}…`}
          className="pl-9 pr-9"
          autoFocus
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {q.trim().length > 1 ? (
        <Tabs defaultValue="repos">
          <TabsList>
            <TabsTrigger value="repos">
              <GitBranch className="size-3.5 mr-1.5" />
              Repositories
              {repos.data && (
                <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{repos.data.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="size-3.5 mr-1.5" />
              Users
              {users.data && (
                <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{users.data.length}</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repos" className="mt-4">
            {repos.error && (
              <p className="text-sm text-destructive">{(repos.error as Error).message}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(repos.data ?? []).map((r) => (
                <Card key={r.id} className="p-4 bg-card/60 backdrop-blur glow flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    {"ownerAvatar" in r && r.ownerAvatar && (
                      <img src={r.ownerAvatar as string} alt="" className="size-5 rounded-full shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/projects/$id"
                        params={{ id: encodeURIComponent(r.fullName) }}
                        className="text-sm font-semibold hover:text-primary truncate block"
                      >
                        {r.fullName}
                      </Link>
                      {r.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{r.description}</p>
                      )}
                    </div>
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground shrink-0">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {r.language && <Badge variant="secondary" className="text-[10px] py-0">{r.language}</Badge>}
                    <span className="flex items-center gap-1"><Star className="size-3" />{r.stars.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><GitFork className="size-3" />{r.forks.toLocaleString()}</span>
                    <span className="ml-auto capitalize text-[10px]">{r.visibility}</span>
                  </div>
                </Card>
              ))}
              {repos.data?.length === 0 && !repos.isFetching && (
                <p className="text-sm text-muted-foreground col-span-full">No repositories found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            {users.error && (
              <p className="text-sm text-destructive">{(users.error as Error).message}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(users.data ?? []).map((u) => (
                <Link key={u.id} to="/users/$login" params={{ login: u.login }}>
                  <Card className="p-4 bg-card/60 backdrop-blur glow flex items-center gap-3 hover:border-primary/60 transition-colors">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{u.name ?? u.login}</div>
                      <div className="text-xs text-muted-foreground truncate">@{u.login}</div>
                    </div>
                    <ExternalLink className="size-3.5 ml-auto shrink-0 text-muted-foreground" />
                  </Card>
                </Link>
              ))}
              {users.data?.length === 0 && !users.isFetching && (
                <p className="text-sm text-muted-foreground col-span-full">No users found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Search className="size-12 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">
            Type at least 2 characters to search {providerLabel}
          </p>
        </div>
      )}
    </div>
  );
}
