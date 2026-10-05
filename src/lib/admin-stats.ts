export type StatsPeriod = "daily" | "weekly" | "monthly" | "yearly";

export const STATS_PERIODS: StatsPeriod[] = ["daily", "weekly", "monthly", "yearly"];

export type StatsBucket = { start: Date; end: Date; label: string };

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function getStatsBuckets(period: StatsPeriod, now: Date = new Date()): StatsBucket[] {
  const buckets: StatsBucket[] = [];

  if (period === "daily") {
    const today = startOfDay(now);
    for (let i = 13; i >= 0; i--) {
      const start = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      });
    }
  } else if (period === "weekly") {
    const todayEnd = new Date(startOfDay(now).getTime() + 24 * 60 * 60 * 1000);
    for (let i = 11; i >= 0; i--) {
      const end = new Date(todayEnd.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      buckets.push({
        start,
        end,
        label: `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
      });
    }
  } else if (period === "monthly") {
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString(undefined, { month: "short", year: "numeric" }),
      });
    }
  } else {
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear() - i, 0, 1);
      const end = new Date(now.getFullYear() - i + 1, 0, 1);
      buckets.push({ start, end, label: String(start.getFullYear()) });
    }
  }

  return buckets;
}
