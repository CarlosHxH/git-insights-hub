import { useSyncExternalStore } from "react";

export type Provider = "github" | "gitlab";

export type Settings = {
  provider: Provider;
  token: string;
  gitlabBaseUrl: string;
  /** GitHub: "owner" or "org". GitLab: numeric group id or path. Optional scope. */
  scope: string;
};

const KEY = "devmetrics.settings.v1";

const defaults: Settings = {
  provider: "github",
  token: "",
  gitlabBaseUrl: "https://gitlab.com",
  scope: "",
};

function read(): Settings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaults;
  }
}

const listeners = new Set<() => void>();
let cache: Settings = read();

function emit() {
  cache = read();
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) emit();
  });
}

export function getSettings(): Settings {
  return cache;
}

export function setSettings(patch: Partial<Settings>) {
  if (typeof window === "undefined") return;
  const next = { ...read(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => defaults,
  );
}