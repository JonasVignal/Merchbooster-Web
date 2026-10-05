import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "../../lib/admin-auth";
import { prisma } from "../../lib/prisma";
import { AdminSignOutButton } from "./AdminSignOutButton";
import { DeleteArtistButton } from "./DeleteArtistButton";
import styles from "./page.module.css";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  const artists = await prisma.artist.findMany({
    include: {
      storefront: true,
      drops: { include: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  const rows = artists.map((artist) => {
    let currentSales = 0;
    let previousSales = 0;
    let hasActiveDrop = false;

    for (const drop of artist.drops) {
      const launch = new Date(drop.launchDate);
      const end = new Date(launch.getTime() + drop.durationHours * 60 * 60 * 1000);
      const isActive = now >= launch && now <= end;
      const dropSales = drop.orders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((sum, order) => sum + order.totalAmount, 0);

      if (isActive) {
        currentSales += dropSales;
        hasActiveDrop = true;
      } else {
        previousSales += dropSales;
      }
    }

    return {
      id: artist.id,
      name: artist.name,
      fullName: artist.fullName,
      email: artist.email,
      phoneNumber: artist.phoneNumber,
      address: artist.address,
      bankAccountNumber: artist.bankAccountNumber,
      slug: artist.slug,
      setupCompleted: artist.setupCompleted,
      createdAt: artist.createdAt,
      hasActiveDrop,
      currentSales,
      previousSales,
    };
  });

  const platformCurrentSales = rows.reduce((sum, r) => sum + r.currentSales, 0);
  const platformPreviousSales = rows.reduce((sum, r) => sum + r.previousSales, 0);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.navLogo}>Merchbooster Admin</span>
        <div className={styles.navLinks}>
          <Link href="/admin" className={styles.navLinkActive}>Artists</Link>
          <Link href="/admin/statistics" className={styles.navLink}>Statistics</Link>
          <AdminSignOutButton />
        </div>
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Artists</h1>
          <p className={styles.subtitle}>Every artist who has created a storefront, with their sales and contact details.</p>
        </header>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Total Artists</h3>
            <p className={styles.summaryStat}>{rows.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Current Sales (live drops)</h3>
            <p className={styles.summaryStat}>{platformCurrentSales.toFixed(2)} DKK</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Previous Sales</h3>
            <p className={styles.summaryStat}>{platformPreviousSales.toFixed(2)} DKK</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Bank Account</th>
                <th>Storefront</th>
                <th>Current Sales</th>
                <th>Previous Sales</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={styles.artistName}>{row.name || "—"}</td>
                  <td>{row.fullName || "—"}</td>
                  <td>{row.email}</td>
                  <td>{row.phoneNumber || "—"}</td>
                  <td>{row.address || "—"}</td>
                  <td>{row.bankAccountNumber || "—"}</td>
                  <td>
                    {row.slug ? (
                      <a href={`/${row.slug}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        /{row.slug}
                      </a>
                    ) : (
                      "—"
                    )}
                    {row.setupCompleted ? (
                      <span className={styles.badgeLive}>Live</span>
                    ) : (
                      <span className={styles.badgeIncomplete}>Incomplete</span>
                    )}
                  </td>
                  <td>
                    {row.currentSales.toFixed(2)} DKK
                    {row.hasActiveDrop && <span className={styles.badgeActive}>Active</span>}
                  </td>
                  <td>{row.previousSales.toFixed(2)} DKK</td>
                  <td>{row.createdAt.toLocaleDateString()}</td>
                  <td>
                    <DeleteArtistButton id={row.id} name={row.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className={styles.emptyState}>No artists have registered yet.</p>}
        </div>
      </main>
    </div>
  );
}
