import { useQuery } from "@tanstack/react-query";
import { fetchCommits, fetchIssues, fetchMembers, fetchPipelines, fetchRepos, type Repo } from "@/lib/api";
import { useSettings } from "@/lib/settings";

const STALE = 1000 * 60 * 5;

export function useRepos() {
  const s = useSettings();
  return useQuery({
    queryKey: ["repos", s.provider, s.scope, s.gitlabBaseUrl, !!s.token],
    queryFn: () => fetchRepos(50),
    staleTime: STALE,
    enabled: !!s.token,
  });
}

export function useRepoCommits(repo: string | undefined, days = 30) {
  const s = useSettings();
  return useQuery({
    queryKey: ["commits", s.provider, repo, days],
    queryFn: () => fetchCommits(repo!, days, 100),
    staleTime: STALE,
    enabled: !!s.token && !!repo,
  });
}

export function useRepoPipelines(repo: string | undefined) {
  const s = useSettings();
  return useQuery({
    queryKey: ["pipelines", s.provider, repo],
    queryFn: () => fetchPipelines(repo!, 50),
    staleTime: STALE,
    enabled: !!s.token && !!repo,
  });
}

export function useRepoIssues(repo: string | undefined) {
  const s = useSettings();
  return useQuery({
    queryKey: ["issues", s.provider, repo],
    queryFn: () => fetchIssues(repo!, 100),
    staleTime: STALE,
    enabled: !!s.token && !!repo,
  });
}

export function useMembers() {
  const s = useSettings();
  return useQuery({
    queryKey: ["members", s.provider, s.scope],
    queryFn: () => fetchMembers(),
    staleTime: STALE,
    enabled: !!s.token,
  });
}

/* Aggregate commits across a set of repos. Limits parallelism to be polite. */
export function useAggregateCommits(repos: Repo[] | undefined, days = 30, max = 8) {
  const s = useSettings();
  const subset = (repos ?? []).slice(0, max).map((r) => r.fullName);
  return useQuery({
    queryKey: ["agg-commits", s.provider, days, subset],
    enabled: !!s.token && subset.length > 0,
    staleTime: STALE,
    queryFn: async () => {
      const results = await Promise.allSettled(subset.map((r) => fetchCommits(r, days, 100)));
      return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    },
  });
}

export function useAggregatePipelines(repos: Repo[] | undefined, max = 8) {
  const s = useSettings();
  const subset = (repos ?? []).slice(0, max).map((r) => r.fullName);
  return useQuery({
    queryKey: ["agg-pipes", s.provider, subset],
    enabled: !!s.token && subset.length > 0,
    staleTime: STALE,
    queryFn: async () => {
      const results = await Promise.allSettled(subset.map((r) => fetchPipelines(r, 50)));
      return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    },
  });
}