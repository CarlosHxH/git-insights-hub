import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

export function KpiCard({
  label, value, delta, icon: Icon, hint,
}: {
  label: string; value: string | number;
  delta?: { value: number; positive?: boolean };
  icon?: LucideIcon; hint?: string;
}) {
  return (
    <Card className="relative overflow-hidden p-5 bg-card/60 backdrop-blur border-border glow">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-primary/80" />}
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && (
          <span className={(delta.positive ?? delta.value >= 0) ? "text-emerald-400" : "text-rose-400"}>
            {delta.value >= 0 ? "+" : ""}{delta.value}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}