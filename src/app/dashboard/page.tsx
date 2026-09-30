import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);

  const artist = session?.user?.email
    ? await prisma.artist.findUnique({
        where: { email: session.user.email },
        include: { drops: { include: { orders: true, packages: true } } },
      })
    : null;

  const now = new Date();
  const drops = artist?.drops ?? [];

  const dropSales = (drop: (typeof drops)[number]) =>
    drop.orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.totalAmount, 0);

  const activeDrop = drops.find((drop) => {
    const start = new Date(drop.launchDate);
    const end = new Date(start.getTime() + drop.durationHours * 60 * 60 * 1000);
    return now >= start && now <= end;
  });

  const upcomingDrops = drops
    .filter((drop) => new Date(drop.launchDate) > now)
    .sort((a, b) => new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime());

  const pastDrops = drops
    .filter((drop) => {
      const end = new Date(drop.launchDate.getTime() + drop.durationHours * 60 * 60 * 1000);
      return end < now;
    })
    .sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {session?.user?.name || "Artist"}</h1>
        <p className={styles.subtitle}>Here is what's happening with your merch.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Active Drop</h3>
          {activeDrop ? (
            <>
              <p className={styles.stat}>Live now</p>
              <p className={styles.meta}>
                Ends {new Date(activeDrop.launchDate.getTime() + activeDrop.durationHours * 60 * 60 * 1000).toLocaleString()}
              </p>
            </>
          ) : (
            <>
              <p className={styles.stat}>No active drop</p>
              <p className={styles.meta}>Schedule your next drop in the Drops tab.</p>
            </>
          )}
        </div>
        <div className={styles.card}>
          <h3>Total Sales</h3>
          <p className={styles.stat}>0.00 DKK</p>
          <p className={styles.meta}>Lifetime revenue</p>
        </div>
        <div className={styles.card}>
          <h3>Storefront Status</h3>
          <p className={styles.stat}>{artist?.setupCompleted ? "Live" : "Incomplete"}</p>
          <a href="/dashboard/storefront" className={styles.link}>Complete setup &rarr;</a>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Drops</h2>
        {upcomingDrops.length > 0 ? (
          <div className={styles.dropList}>
            {upcomingDrops.map((drop) => (
              <div key={drop.id} className={styles.dropRow}>
                <div>
                  <p className={styles.dropDate}>{new Date(drop.launchDate).toLocaleString()}</p>
                  <p className={styles.meta}>
                    {drop.durationHours}h sale window &middot; {drop.packages.map((p) => p.type).join(", ")}
                  </p>
                </div>
                <span className={styles.dropStatus}>{drop.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.meta}>
            No upcoming drops scheduled. <a href="/dashboard/drops" className={styles.link}>Schedule one &rarr;</a>
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Past Drops</h2>
        {pastDrops.length > 0 ? (
          <div className={styles.dropList}>
            {pastDrops.map((drop) => (
              <div key={drop.id} className={styles.dropRow}>
                <div>
                  <p className={styles.dropDate}>{new Date(drop.launchDate).toLocaleString()}</p>
                  <p className={styles.meta}>
                    {drop.durationHours}h sale window &middot; {drop.packages.map((p) => p.type).join(", ")}
                  </p>
                </div>
                <p className={styles.dropSales}>{dropSales(drop).toFixed(2)} DKK sold</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.meta}>No past drops yet.</p>
        )}
      </section>
    </div>
  );
}
