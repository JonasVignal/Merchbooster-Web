import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";
import { SignOutButton } from "./SignOutButton";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const artist = session.user?.email
    ? await prisma.artist.findUnique({
        where: { email: session.user.email },
        select: { slug: true },
      })
    : null;

  return (
    <div className={styles.dashboard}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>Merchbooster</div>
        <ul className={styles.navLinks}>
          <li><a href="/dashboard">Overview</a></li>
          <li><a href="/dashboard/storefront">Storefront Settings</a></li>
          <li><a href="/dashboard/packages">Merch Packages</a></li>
          <li><a href="/dashboard/drops">Drop Schedule</a></li>
          <li><a href="/dashboard/personal-info">Personal Info</a></li>
          <li><a href="/dashboard/finans">Finans</a></li>
          {artist?.slug && (
            <li>
              <a href={`/${artist.slug}`} target="_blank" rel="noopener noreferrer">
                View Shop
              </a>
            </li>
          )}
          <li className={styles.signOutItem}><SignOutButton /></li>
        </ul>
        <div className={styles.user}>
          {session.user?.name || session.user?.email}
        </div>
      </nav>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
