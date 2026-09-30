import { prisma } from "../lib/prisma";
import { CountdownBadge } from "./CountdownBadge";
import styles from "./page.module.css";

const MERCHBOOSTER_URL = process.env.NEXT_PUBLIC_MERCHBOOSTER_URL || "http://localhost:3000";

const FEATURED_COUNT = 6;
const CLOSING_SOON_COUNT = 6;

function artistBackground(themeColorStart: string, themeColorEnd: string | null) {
  return themeColorEnd
    ? `linear-gradient(135deg, ${themeColorStart}, ${themeColorEnd})`
    : themeColorStart;
}

export default async function Home() {
  const now = new Date();

  const artists = await prisma.artist.findMany({
    where: {
      setupCompleted: true,
      slug: { not: null },
      storefront: { isNot: null },
    },
    include: {
      storefront: true,
      drops: { include: { orders: true } },
    },
  });

  const featuredArtists = artists
    .map((artist) => ({
      artist,
      revenue: artist.drops
        .flatMap((drop) => drop.orders)
        .filter((order) => order.paymentStatus === "paid")
        .reduce((total, order) => total + order.totalAmount, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue || b.artist.createdAt.getTime() - a.artist.createdAt.getTime())
    .slice(0, FEATURED_COUNT);

  const launchedDrops = await prisma.drop.findMany({
    where: {
      launchDate: { lte: now },
      artist: { slug: { not: null }, storefront: { isNot: null } },
    },
    include: {
      artist: { include: { storefront: true } },
      packages: true,
    },
  });

  const closingSoon = launchedDrops
    .map((drop) => ({
      drop,
      end: new Date(drop.launchDate.getTime() + drop.durationHours * 60 * 60 * 1000),
    }))
    .filter(({ end }) => end > now)
    .sort((a, b) => a.end.getTime() - b.end.getTime())
    .slice(0, CLOSING_SOON_COUNT);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.navLogo}>Backstage Drop</span>
        <a href={MERCHBOOSTER_URL} className={styles.navCta}>
          Become an artist →
        </a>
      </nav>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Discover drops from your <span className={styles.heroHighlight}>favorite artists</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Every artist storefront and limited-time merch drop created on Merchbooster, in one place.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Artists</h2>
        {featuredArtists.length > 0 ? (
          <div className={styles.artistGrid}>
            {featuredArtists.map(({ artist }) => (
              <a
                key={artist.id}
                href={`${MERCHBOOSTER_URL}/${artist.slug}`}
                className={styles.artistCard}
                style={{ background: artistBackground(artist.storefront!.themeColorStart, artist.storefront!.themeColorEnd) }}
              >
                {artist.storefront?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artist.storefront.logoUrl} alt={`${artist.name} logo`} className={styles.artistLogo} />
                ) : (
                  <span className={styles.artistName}>{artist.name}</span>
                )}
              </a>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No artists have set up their storefront yet.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Drops Closing Soon</h2>
        {closingSoon.length > 0 ? (
          <div className={styles.dropGrid}>
            {closingSoon.map(({ drop, end }) => (
              <a
                key={drop.id}
                href={`${MERCHBOOSTER_URL}/${drop.artist.slug}`}
                className={styles.dropCard}
              >
                <div
                  className={styles.dropCardBanner}
                  style={{
                    background: artistBackground(
                      drop.artist.storefront!.themeColorStart,
                      drop.artist.storefront!.themeColorEnd
                    ),
                  }}
                >
                  {drop.artist.storefront?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={drop.artist.storefront.logoUrl}
                      alt={`${drop.artist.name} logo`}
                      className={styles.dropCardLogo}
                    />
                  ) : (
                    <span className={styles.dropCardArtistName}>{drop.artist.name}</span>
                  )}
                </div>
                <div className={styles.dropCardInfo}>
                  <p className={styles.dropCardPackages}>
                    {drop.packages.map((p) => p.type).join(", ") || "Merch drop"}
                  </p>
                  <CountdownBadge endTime={end.toISOString()} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No drops are live right now — check back soon.</p>
        )}
      </section>

      <footer className={styles.footer}>
        <p>Backstage Drop is powered by Merchbooster.</p>
      </footer>
    </div>
  );
}
