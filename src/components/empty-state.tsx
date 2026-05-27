import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export function NoToken() {
  return (
    <Card className="p-8 text-center max-w-xl mx-auto bg-card/60 backdrop-blur glow">
      <div className="mx-auto size-12 rounded-xl bg-primary/15 text-primary grid place-items-center">
        <KeyRound className="size-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Connect your account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a personal access token in Settings to start pulling data from GitHub or GitLab.
      </p>
      <Link
        to="/settings"
        className="mt-5 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Open settings
      </Link>
    </Card>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="p-6 border-destructive/40 bg-destructive/5">
      <div className="text-sm text-destructive break-words">{message}</div>
    </Card>
  );
}