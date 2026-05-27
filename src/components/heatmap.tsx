import { useMemo } from "react";

/** GitHub-style 53×7 calendar heatmap. */
export function Heatmap({ dates, weeks = 26 }: { dates: string[]; weeks?: number }) {
  const cells = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of dates) {
      const key = new Date(d).toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (weeks * 7 - 1));
    // Align start to Monday
    const day = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - day);

    const total = weeks * 7;
    const out: { date: string; count: number }[] = [];
    for (let i = 0; i < total; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      out.push({ date: key, count: counts.get(key) ?? 0 });
    }
    return out;
  }, [dates, weeks]);

  const max = Math.max(1, ...cells.map((c) => c.count));
  const level = (n: number) => {
    if (n === 0) return 0;
    const r = n / max;
    if (r < 0.25) return 1;
    if (r < 0.5) return 2;
    if (r < 0.75) return 3;
    return 4;
  };

  const palette = [
    "oklch(1 0 0 / 0.05)",
    "oklch(0.65 0.12 200 / 0.4)",
    "oklch(0.7 0.15 200 / 0.6)",
    "oklch(0.75 0.18 200 / 0.8)",
    "oklch(0.85 0.2 195)",
  ];

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1 w-max"
        style={{
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridAutoFlow: "column",
        }}
      >
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date} · ${c.count} commits`}
            className="size-3 rounded-[3px] transition-transform hover:scale-110"
            style={{ background: palette[level(c.count)] }}
          />
        ))}
      </div>
    </div>
  );
}