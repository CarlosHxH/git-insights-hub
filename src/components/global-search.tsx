import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { useRepos, useMembers } from "@/hooks/use-analytics";
import { GitBranch, User, Compass } from "lucide-react";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const repos = useRepos();
  const members = useMembers();

  function go(to: Parameters<typeof navigate>[0]["to"], params?: Record<string, string>) {
    onOpenChange(false);
    navigate({ to, params } as Parameters<typeof navigate>[0]);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, users…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Search GitHub / GitLab">
          <CommandItem
            value="explore search all github gitlab"
            onSelect={() => go("/explore")}
          >
            <Compass className="size-4" />
            <span>Search all of GitHub / GitLab…</span>
            <span className="ml-auto text-xs text-muted-foreground">Explore</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="My Projects">
          {(repos.data ?? []).slice(0, 20).map((r) => (
            <CommandItem
              key={r.id}
              value={r.fullName}
              onSelect={() => go("/projects/$id", { id: encodeURIComponent(r.fullName) })}
            >
              <GitBranch className="size-4" />
              <span>{r.fullName}</span>
              <span className="ml-auto text-xs text-muted-foreground">★ {r.stars}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Users">
          {(members.data ?? []).slice(0, 20).map((m) => (
            <CommandItem
              key={m.id}
              value={m.login}
              onSelect={() => go("/users/$login", { login: m.login })}
            >
              <User className="size-4" />
              {m.login}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
