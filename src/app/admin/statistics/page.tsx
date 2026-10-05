import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "../../../lib/admin-auth";
import { prisma } from "../../../lib/prisma";
import { STATS_PERIODS, StatsPeriod, getStatsBuckets } from "../../../lib/admin-stats";
import { AdminSignOutButton } from "../AdminSignOutButton";
import styles from "../page.module.css";

const PERIOD_LABELS: Record<StatsPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default async function AdminStatistics({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  const { period: rawPeriod } = await searchParams;
  const period: StatsPeriod = STATS_PERIODS.includes(rawPeriod as StatsPeriod)
    ? (rawPeriod as StatsPeriod)
    : "daily";

  const [artists, orders] = await Promise.all([
    prisma.artist.findMany({ select: { createdAt: true } }),
    prisma.order.findMany({
      where: { paymentStatus: "paid" },
      select: { createdAt: true, totalAmount: true },
    }),
  ]);

  const buckets = getStatsBuckets(period).map((bucket) => {
    const newArtists = artists.filter(
      (a) => a.createdAt >= bucket.start && a.createdAt < bucket.end
    ).length;
    const bucketOrders = orders.filter(
      (o) => o.createdAt >= bucket.start && o.createdAt < bucket.end
    );

    return {
      label: bucket.label,
      newArtists,
      salesCount: bucketOrders.length,
      salesAmount: bucketOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
  });

  const totalNewArtists = buckets.reduce((sum, b) => sum + b.newArtists, 0);
  const totalSalesCount = buckets.reduce((sum, b) => sum + b.salesCount, 0);
  const totalSalesAmount = buckets.reduce((sum, b) => sum + b.salesAmount, 0);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.navLogo}>Merchbooster Admin</span>
        <div className={styles.navLinks}>
          <Link href="/admin" className={styles.navLink}>Artists</Link>
          <Link href="/admin/statistics" className={styles.navLinkActive}>Statistics</Link>
          <AdminSignOutButton />
        </div>
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Statistics</h1>
          <p className={styles.subtitle}>
            Platform-wide numbers for artists and sales, broken down by {PERIOD_LABELS[period].toLowerCase()} period.
          </p>
        </header>

        <div className={styles.periodTabs}>
          {STATS_PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/statistics?period=${p}`}
              className={p === period ? styles.periodTabActive : styles.periodTab}
            >
              {PERIOD_LABELS[p]}
            </Link>
          ))}
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Total Artists (all time)</h3>
            <p className={styles.summaryStat}>{artists.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>New Artists in range</h3>
            <p className={styles.summaryStat}>{totalNewArtists}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Number of Sales in range</h3>
            <p className={styles.summaryStat}>{totalSalesCount}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Sales Amount in range</h3>
            <p className={styles.summaryStat}>{totalSalesAmount.toFixed(2)} DKK</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{PERIOD_LABELS[period]} period</th>
                <th>New Artists</th>
                <th>Number of Sales</th>
                <th>Sales Amount</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket) => (
                <tr key={bucket.label}>
                  <td className={styles.artistName}>{bucket.label}</td>
                  <td>{bucket.newArtists}</td>
                  <td>{bucket.salesCount}</td>
                  <td>{bucket.salesAmount.toFixed(2)} DKK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
