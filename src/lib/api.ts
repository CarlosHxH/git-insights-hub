import { getSettings, type Provider } from "./settings";

export type Repo = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  language: string | null;
  url: string;
  updatedAt: string;
  visibility: string;
};

export type Commit = {
  sha: string;
  message: string;
  author: string;
  authorEmail?: string;
  date: string;
  url: string;
  repo: string;
};

export type Member = {
  id: string;
  login: string;
  name: string | null;
  avatar: string;
  url: string;
};

export type Pipeline = {
  id: string;
  status: "success" | "failed" | "running" | "canceled" | "pending" | "unknown";
  ref: string;
  startedAt: string;
  finishedAt: string | null;
  durationSec: number | null;
  url: string;
  repo: string;
};

export type Issue = {
  id: string;
  title: string;
  state: "open" | "closed";
  createdAt: string;
  closedAt: string | null;
  author: string;
  url: string;
  repo: string;
  isPR: boolean;
  mergedAt?: string | null;
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function ghFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const { token } = getSettings();
  const url = new URL(`https://api.github.com${path}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new ApiError(res.status, `GitHub ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

async function glFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const { token, gitlabBaseUrl } = getSettings();
  const base = gitlabBaseUrl.replace(/\/$/, "");
  const url = new URL(`${base}/api/v4${path}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: { ...(token ? { "PRIVATE-TOKEN": token } : {}) },
  });
  if (!res.ok) throw new ApiError(res.status, `GitLab ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

function provider(): Provider {
  return getSettings().provider;
}

/* ----------------------------- Mappers ---------------------------------- */

type GHRepo = {
  id: number; name: string; full_name: string; description: string | null;
  stargazers_count: number; forks_count: number; open_issues_count: number;
  default_branch: string; language: string | null; html_url: string;
  updated_at: string; visibility: string;
};
type GLProject = {
  id: number; name: string; path_with_namespace: string; description: string | null;
  star_count: number; forks_count: number; open_issues_count?: number;
  default_branch: string | null; web_url: string; last_activity_at: string;
  visibility: string;
};

function ghRepo(r: GHRepo): Repo {
  return {
    id: `gh:${r.id}`, name: r.name, fullName: r.full_name, description: r.description,
    stars: r.stargazers_count, forks: r.forks_count, openIssues: r.open_issues_count,
    defaultBranch: r.default_branch, language: r.language, url: r.html_url,
    updatedAt: r.updated_at, visibility: r.visibility,
  };
}
function glProject(p: GLProject): Repo {
  return {
    id: `gl:${p.id}`, name: p.name, fullName: p.path_with_namespace, description: p.description,
    stars: p.star_count, forks: p.forks_count, openIssues: p.open_issues_count ?? 0,
    defaultBranch: p.default_branch ?? "main", language: null, url: p.web_url,
    updatedAt: p.last_activity_at, visibility: p.visibility,
  };
}

/* ----------------------------- Public API -------------------------------- */

export async function fetchRepos(perPage = 50): Promise<Repo[]> {
  if (provider() === "github") {
    const { scope } = getSettings();
    if (scope) {
      // try org first, fallback to user
      try {
        const list = await ghFetch<GHRepo[]>(`/orgs/${scope}/repos`, {
          per_page: perPage, sort: "updated",
        });
        return list.map(ghRepo);
      } catch {
        const list = await ghFetch<GHRepo[]>(`/users/${scope}/repos`, {
          per_page: perPage, sort: "updated",
        });
        return list.map(ghRepo);
      }
    }
    const list = await ghFetch<GHRepo[]>(`/user/repos`, {
      per_page: perPage, sort: "updated", affiliation: "owner,collaborator,organization_member",
    });
    return list.map(ghRepo);
  } else {
    const { scope } = getSettings();
    if (scope) {
      const list = await glFetch<GLProject[]>(`/groups/${encodeURIComponent(scope)}/projects`, {
        per_page: perPage, order_by: "last_activity_at", include_subgroups: "true" as unknown as string,
      });
      return list.map(glProject);
    }
    const list = await glFetch<GLProject[]>(`/projects`, {
      per_page: perPage, order_by: "last_activity_at", membership: "true" as unknown as string,
    });
    return list.map(glProject);
  }
}

export async function fetchCommits(repoFullName: string, sinceDays = 30, perPage = 100): Promise<Commit[]> {
  const since = new Date(Date.now() - sinceDays * 86400_000).toISOString();
  if (provider() === "github") {
    type GHC = {
      sha: string; html_url: string;
      commit: { message: string; author: { name: string; email: string; date: string } };
      author: { login?: string } | null;
    };
    const list = await ghFetch<GHC[]>(`/repos/${repoFullName}/commits`, { per_page: perPage, since });
    return list.map((c) => ({
      sha: c.sha, message: c.commit.message.split("\n")[0],
      author: c.author?.login || c.commit.author.name,
      authorEmail: c.commit.author.email, date: c.commit.author.date,
      url: c.html_url, repo: repoFullName,
    }));
  } else {
    type GLC = {
      id: string; title: string; author_name: string; author_email: string;
      created_at: string; web_url: string;
    };
    const id = encodeURIComponent(repoFullName);
    const list = await glFetch<GLC[]>(`/projects/${id}/repository/commits`, {
      per_page: perPage, since,
    });
    return list.map((c) => ({
      sha: c.id, message: c.title, author: c.author_name,
      authorEmail: c.author_email, date: c.created_at, url: c.web_url, repo: repoFullName,
    }));
  }
}

export async function fetchPipelines(repoFullName: string, perPage = 50): Promise<Pipeline[]> {
  if (provider() === "github") {
    type GHRun = {
      id: number; status: string; conclusion: string | null; head_branch: string;
      created_at: string; updated_at: string; html_url: string; run_started_at?: string;
    };
    const data = await ghFetch<{ workflow_runs: GHRun[] }>(`/repos/${repoFullName}/actions/runs`, {
      per_page: perPage,
    });
    return data.workflow_runs.map((r) => {
      const started = r.run_started_at ?? r.created_at;
      const finished = r.status === "completed" ? r.updated_at : null;
      const dur = finished ? Math.round((+new Date(finished) - +new Date(started)) / 1000) : null;
      let status: Pipeline["status"] = "unknown";
      if (r.status === "completed") status = r.conclusion === "success" ? "success" : r.conclusion === "cancelled" ? "canceled" : "failed";
      else if (r.status === "in_progress" || r.status === "queued") status = "running";
      return { id: String(r.id), status, ref: r.head_branch, startedAt: started, finishedAt: finished, durationSec: dur, url: r.html_url, repo: repoFullName };
    });
  } else {
    type GLP = { id: number; status: string; ref: string; created_at: string; updated_at: string; web_url: string; duration: number | null };
    const id = encodeURIComponent(repoFullName);
    const list = await glFetch<GLP[]>(`/projects/${id}/pipelines`, { per_page: perPage });
    return list.map((p) => {
      const map: Record<string, Pipeline["status"]> = {
        success: "success", failed: "failed", running: "running", pending: "pending", canceled: "canceled",
      };
      return { id: String(p.id), status: map[p.status] ?? "unknown", ref: p.ref, startedAt: p.created_at, finishedAt: p.updated_at, durationSec: p.duration, url: p.web_url, repo: repoFullName };
    });
  }
}

export async function fetchIssues(repoFullName: string, perPage = 100): Promise<Issue[]> {
  if (provider() === "github") {
    type GHI = {
      id: number; title: string; state: "open" | "closed"; created_at: string; closed_at: string | null;
      user: { login: string } | null; html_url: string; pull_request?: { merged_at?: string | null };
    };
    const list = await ghFetch<GHI[]>(`/repos/${repoFullName}/issues`, { per_page: perPage, state: "all" });
    return list.map((i) => ({
      id: String(i.id), title: i.title, state: i.state, createdAt: i.created_at, closedAt: i.closed_at,
      author: i.user?.login ?? "unknown", url: i.html_url, repo: repoFullName,
      isPR: !!i.pull_request, mergedAt: i.pull_request?.merged_at ?? null,
    }));
  } else {
    type GLI = { id: number; title: string; state: string; created_at: string; closed_at: string | null; author: { username: string }; web_url: string };
    const id = encodeURIComponent(repoFullName);
    const issues = await glFetch<GLI[]>(`/projects/${id}/issues`, { per_page: perPage, scope: "all" });
    const mrs = await glFetch<(GLI & { merged_at?: string | null })[]>(
      `/projects/${id}/merge_requests`, { per_page: perPage, scope: "all" },
    );
    const norm = (x: GLI, isPR: boolean, mergedAt?: string | null): Issue => ({
      id: String(x.id), title: x.title,
      state: x.state === "opened" ? "open" : "closed",
      createdAt: x.created_at, closedAt: x.closed_at, author: x.author.username,
      url: x.web_url, repo: repoFullName, isPR, mergedAt: mergedAt ?? null,
    });
    return [...issues.map((i) => norm(i, false)), ...mrs.map((m) => norm(m, true, m.merged_at))];
  }
}

export async function fetchMembers(): Promise<Member[]> {
  const { scope } = getSettings();
  if (provider() === "github") {
    if (!scope) {
      const me = await ghFetch<{ id: number; login: string; name: string | null; avatar_url: string; html_url: string }>("/user");
      return [{ id: String(me.id), login: me.login, name: me.name, avatar: me.avatar_url, url: me.html_url }];
    }
    try {
      const list = await ghFetch<{ id: number; login: string; avatar_url: string; html_url: string }[]>(`/orgs/${scope}/members`, { per_page: 100 });
      return list.map((m) => ({ id: String(m.id), login: m.login, name: null, avatar: m.avatar_url, url: m.html_url }));
    } catch {
      const me = await ghFetch<{ id: number; login: string; name: string | null; avatar_url: string; html_url: string }>(`/users/${scope}`);
      return [{ id: String(me.id), login: me.login, name: me.name, avatar: me.avatar_url, url: me.html_url }];
    }
  } else {
    if (scope) {
      const list = await glFetch<{ id: number; username: string; name: string; avatar_url: string; web_url: string }[]>(
        `/groups/${encodeURIComponent(scope)}/members/all`, { per_page: 100 },
      );
      return list.map((m) => ({ id: String(m.id), login: m.username, name: m.name, avatar: m.avatar_url, url: m.web_url }));
    }
    const me = await glFetch<{ id: number; username: string; name: string; avatar_url: string; web_url: string }>("/user");
    return [{ id: String(me.id), login: me.username, name: me.name, avatar: me.avatar_url, url: me.web_url }];
  }
}

/* ----------------------------- Search & Explore -------------------------- */

export type UserProfile = {
  login: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  url: string;
  followers: number;
  following: number;
  publicRepos: number;
  company: string | null;
  location: string | null;
  blog: string | null;
  createdAt: string;
  provider: "github" | "gitlab";
};

export type UserEvent = {
  id: string;
  type: string;
  repo: string;
  date: string;
  summary: string;
};

export type SearchRepoResult = Repo & { ownerAvatar?: string };

export async function searchRepos(query: string, perPage = 30): Promise<SearchRepoResult[]> {
  if (!query.trim()) return [];
  if (provider() === "github") {
    type GHSRepos = { items: (GHRepo & { owner: { avatar_url: string } })[] };
    const data = await ghFetch<GHSRepos>("/search/repositories", {
      q: query, per_page: perPage, sort: "stars", order: "desc",
    });
    return data.items.map((r) => ({ ...ghRepo(r), ownerAvatar: r.owner?.avatar_url }));
  } else {
    const list = await glFetch<GLProject[]>("/projects", {
      search: query, per_page: perPage, order_by: "star_count", sort: "desc",
    });
    return list.map(glProject);
  }
}

export async function searchUsers(query: string, perPage = 30): Promise<Member[]> {
  if (!query.trim()) return [];
  if (provider() === "github") {
    type GHSUsers = { items: { id: number; login: string; avatar_url: string; html_url: string }[] };
    const data = await ghFetch<GHSUsers>("/search/users", { q: query, per_page: perPage });
    return data.items.map((u) => ({ id: String(u.id), login: u.login, name: null, avatar: u.avatar_url, url: u.html_url }));
  } else {
    type GLU = { id: number; username: string; name: string; avatar_url: string; web_url: string };
    const list = await glFetch<GLU[]>("/users", { search: query, per_page: perPage });
    return list.map((u) => ({ id: String(u.id), login: u.username, name: u.name, avatar: u.avatar_url, url: u.web_url }));
  }
}

export async function fetchUserProfile(login: string): Promise<UserProfile> {
  if (provider() === "github") {
    type GHUser = {
      id: number; login: string; name: string | null; avatar_url: string; bio: string | null;
      html_url: string; followers: number; following: number; public_repos: number;
      company: string | null; location: string | null; blog: string | null; created_at: string;
    };
    const u = await ghFetch<GHUser>(`/users/${login}`);
    return {
      login: u.login, name: u.name, avatar: u.avatar_url, bio: u.bio, url: u.html_url,
      followers: u.followers, following: u.following, publicRepos: u.public_repos,
      company: u.company, location: u.location, blog: u.blog || null,
      createdAt: u.created_at, provider: "github",
    };
  } else {
    type GLUser = {
      id: number; username: string; name: string; avatar_url: string; bio: string | null;
      web_url: string; followers: number; following: number; public_repos?: number;
      organization: string | null; location: string | null; website_url: string | null; created_at: string;
    };
    const u = await glFetch<GLUser>(`/users/${encodeURIComponent(login)}`);
    return {
      login: u.username, name: u.name, avatar: u.avatar_url, bio: u.bio, url: u.web_url,
      followers: u.followers ?? 0, following: u.following ?? 0, publicRepos: u.public_repos ?? 0,
      company: u.organization, location: u.location, blog: u.website_url || null,
      createdAt: u.created_at, provider: "gitlab",
    };
  }
}

export async function fetchUserRepos(login: string, perPage = 30): Promise<Repo[]> {
  if (provider() === "github") {
    const list = await ghFetch<GHRepo[]>(`/users/${login}/repos`, {
      per_page: perPage, sort: "updated", type: "public",
    });
    return list.map(ghRepo);
  } else {
    type GLU = { id: number };
    const user = await glFetch<GLU>(`/users/${encodeURIComponent(login)}`);
    const list = await glFetch<GLProject[]>(`/users/${user.id}/projects`, {
      per_page: perPage, order_by: "last_activity_at",
    });
    return list.map(glProject);
  }
}

export async function fetchUserActivity(login: string, perPage = 30): Promise<UserEvent[]> {
  if (provider() === "github") {
    type GHEvent = {
      id: string; type: string; created_at: string;
      repo: { name: string };
      payload: {
        commits?: { message: string }[];
        action?: string;
        ref?: string;
        pull_request?: { title: string };
        issue?: { title: string };
      };
    };
    const list = await ghFetch<GHEvent[]>(`/users/${login}/events/public`, { per_page: perPage });
    return list.map((e) => {
      let summary = e.type.replace("Event", "");
      if (e.type === "PushEvent" && e.payload.commits?.length) {
        summary = `Pushed: ${e.payload.commits[0].message.split("\n")[0]}`;
      } else if (e.type === "PullRequestEvent") {
        summary = `PR ${e.payload.action}: ${e.payload.pull_request?.title ?? ""}`;
      } else if (e.type === "IssuesEvent") {
        summary = `Issue ${e.payload.action}: ${e.payload.issue?.title ?? ""}`;
      } else if (e.type === "CreateEvent") {
        summary = `Created ${e.payload.ref ?? ""}`;
      } else if (e.type === "WatchEvent") {
        summary = "Starred";
      } else if (e.type === "ForkEvent") {
        summary = "Forked";
      }
      return { id: e.id, type: e.type, repo: e.repo.name, date: e.created_at, summary };
    });
  } else {
    type GLEvent = {
      id: number; action_name: string; created_at: string;
      project_id: number;
      push_data?: { commit_title?: string };
      target_title?: string;
    };
    const list = await glFetch<GLEvent[]>(`/users/${encodeURIComponent(login)}/events`, { per_page: perPage });
    return list.map((e) => ({
      id: String(e.id),
      type: e.action_name,
      repo: String(e.project_id),
      date: e.created_at,
      summary: e.push_data?.commit_title ?? e.target_title ?? e.action_name,
    }));
  }
}

export async function fetchReadme(repoFullName: string): Promise<string | null> {
  try {
    if (provider() === "github") {
      const r = await ghFetch<{ content: string; encoding: string }>(`/repos/${repoFullName}/readme`);
      return r.encoding === "base64" ? atob(r.content.replace(/\n/g, "")) : r.content;
    } else {
      const id = encodeURIComponent(repoFullName);
      const { default_branch } = await glFetch<{ default_branch: string }>(`/projects/${id}`);
      const res = await fetch(
        `${getSettings().gitlabBaseUrl.replace(/\/$/, "")}/api/v4/projects/${id}/repository/files/README.md/raw?ref=${default_branch}`,
        { headers: { "PRIVATE-TOKEN": getSettings().token } },
      );
      if (!res.ok) return null;
      return await res.text();
    }
  } catch {
    return null;
  }
}