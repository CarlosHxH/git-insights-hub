# DevMetrics — Git Insights Hub

Analytics dashboard for GitHub and GitLab. Visualize commits, pipelines, issues, team activity, and explore any public repository or user profile — all from your browser.

## Features

- **Overview** — KPI cards (repos, commits, pipelines, open issues, stars), commit velocity chart, activity heatmap, top contributors
- **Explore** — search public repositories and users across all of GitHub / GitLab with live results
- **User profiles** — avatar, bio, follower stats, top repositories, language breakdown, activity feed and heatmap for any user
- **Projects** — paginated table of your repositories with language, stars, forks, and issue counts
- **Activity** — unified commit feed across all your repos for the last 30 days
- **Pipelines** — CI/CD run history with status, duration, and branch
- **Privacy-first** — all API calls run directly from your browser; no server, no database, no telemetry

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [TanStack Router](https://tanstack.com/router) (file-based routing) + [TanStack Query](https://tanstack.com/query) (caching)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives)
- [Recharts](https://recharts.org) for charts
- [Vite](https://vitejs.dev) + [TanStack Start](https://tanstack.com/start)

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, go to **Settings**, paste a personal access token, and save.

## Token scopes

### GitHub (Personal Access Token)

| Scope | Purpose |
|-------|---------|
| `repo` | Read commits, issues, Actions runs (private repos) |
| `read:org` | List organization members and repos |
| `read:user` | Read the authenticated user profile |

Create at: **GitHub → Settings → Developer settings → Personal access tokens**

### GitLab (Personal Access Token)

| Scope | Purpose |
|-------|---------|
| `read_api` | Projects, commits, pipelines, issues, MRs, user search |
| `read_user` | Authenticated user profile |
| `read_repository` | Repository contents (README) |

Create at: **GitLab → User Settings → Access Tokens**

> Without a token the GitHub API is limited to 60 requests/hour. GitLab requires a token for most endpoints.

## Configuration

All settings are stored in `localStorage` — nothing leaves your browser.

| Field | Description |
|-------|-------------|
| **Provider** | `github` or `gitlab` |
| **Token** | Personal access token |
| **GitLab base URL** | Default `https://gitlab.com`; change for self-hosted instances |
| **Scope** | Optional. GitHub: owner login or org name. GitLab: group ID or full path. Leave blank to use your own repos |

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build locally
npm run lint       # ESLint
npm run format     # Prettier
npm run deploy     # deploy to GitHub Pages (gh-pages)
```

## License

MIT
