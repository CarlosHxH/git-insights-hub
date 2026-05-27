import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { useRepos, useMembers } from "@/hooks/use-analytics";
import { GitBranch, User } from "lucide-react";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const repos = useRepos();
  const members = useMembers();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, users…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Projects">
          {(repos.data ?? []).slice(0, 20).map((r) => (
            <CommandItem
              key={r.id}
              value={r.fullName}
              onSelect={() => {
                onOpenChange(false);
                navigate({ to: "/projects/$id", params: { id: encodeURIComponent(r.fullName) } });
              }}
            >
              <GitBranch className="size-4" />
              <span>{r.fullName}</span>
              <span className="ml-auto text-xs text-muted-foreground">★ {r.stars}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Users">
          {(members.data ?? []).slice(0, 20).map((m) => (
            <CommandItem key={m.id} value={m.login} onSelect={() => onOpenChange(false)}>
              <User className="size-4" />
              {m.login}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}