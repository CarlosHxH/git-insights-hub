import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { setSettings, useSettings } from "@/lib/settings";
import { toast } from "sonner";
import { Github, Gitlab } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const s = useSettings();
  const [local, setLocal] = useState(s);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Tokens are stored only in your browser (localStorage). No server, no database.
        </p>
      </div>

      <Card className="p-6 bg-card/60 backdrop-blur glow space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {local.provider === "github" ? <Github className="size-5" /> : <Gitlab className="size-5" />}
            <div>
              <div className="font-medium">{local.provider === "github" ? "GitHub" : "GitLab"}</div>
              <div className="text-xs text-muted-foreground">
                Toggle to switch provider
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={local.provider === "github" ? "text-foreground" : "text-muted-foreground"}>GH</span>
            <Switch
              checked={local.provider === "gitlab"}
              onCheckedChange={(v) => setLocal({ ...local, provider: v ? "gitlab" : "github" })}
            />
            <span className={local.provider === "gitlab" ? "text-foreground" : "text-muted-foreground"}>GL</span>
          </div>
        </div>

        {local.provider === "gitlab" && (
          <div className="space-y-2">
            <Label htmlFor="gl">GitLab base URL</Label>
            <Input
              id="gl"
              placeholder="https://gitlab.com or https://gitlab.mycorp.dev"
              value={local.gitlabBaseUrl}
              onChange={(e) => setLocal({ ...local, gitlabBaseUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Self-hosted instances are supported.</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="token">Personal access token</Label>
          <Input
            id="token"
            type="password"
            placeholder={local.provider === "github" ? "ghp_…" : "glpat-…"}
            value={local.token}
            onChange={(e) => setLocal({ ...local, token: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {local.provider === "github"
              ? "Needs scopes: repo, read:org, read:user."
              : "Needs scopes: read_api, read_repository, read_user."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scope">Scope (optional)</Label>
          <Input
            id="scope"
            placeholder={local.provider === "github" ? "owner or organization" : "group id or full path"}
            value={local.scope}
            onChange={(e) => setLocal({ ...local, scope: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use your own repos/projects.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setLocal({ provider: "github", token: "", gitlabBaseUrl: "https://gitlab.com", scope: "" });
              setSettings({ provider: "github", token: "", gitlabBaseUrl: "https://gitlab.com", scope: "" });
              toast.success("Cleared");
            }}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              setSettings(local);
              toast.success("Saved");
            }}
          >
            Save
          </Button>
        </div>
      </Card>

      <Card className="p-5 bg-card/60 backdrop-blur text-xs text-muted-foreground space-y-2">
        <div className="font-medium text-foreground">Privacy</div>
        <p>All API calls run from your browser directly to the provider. Nothing is sent to a third-party server.</p>
      </Card>
    </div>
  );
}