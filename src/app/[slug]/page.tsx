import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { CountdownTimer } from "./CountdownTimer";
import { ImageCarousel } from "./ImageCarousel";
import { ProductsSection } from "./ProductsSection";
import { BasketBadge } from "./BasketBadge";
import { SocialLinks } from "./SocialLinks";
import { getStorefrontTheme } from "../../lib/theme";
import { STOREFRONT_FOOTER_COLUMNS } from "../../lib/storefront-footer";
import styles from "./page.module.css";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      storefront: true,
      drops: {
        orderBy: { launchDate: "desc" },
        take: 1,
      },
    },
  });

  if (!artist || !artist.storefront) {
    notFound();
  }

  const activeDrop = artist.drops[0];
  const now = new Date();

  let isDropActive = false;
  let dropEnd: Date | null = null;

  if (activeDrop) {
    const launch = new Date(activeDrop.launchDate);
    dropEnd = new Date(launch.getTime() + activeDrop.durationHours * 60 * 60 * 1000);

    if (now >= launch && now <= dropEnd) {
      isDropActive = true;
    }
  }

  const { background, needsDarkText, fontFamily, fontHref, customFontUrl } = getStorefrontTheme(
    artist.storefront
  );

  const additionalImages: string[] = artist.storefront.additionalImages
    ? JSON.parse(artist.storefront.additionalImages)
    : [];

  return (
    <div
      className={`${styles.container} ${needsDarkText ? styles.darkText : ""}`}
      style={{ fontFamily, background }}
    >
      {customFontUrl && (
        <style>{`@font-face { font-family: "StorefrontCustomFont"; src: url(${JSON.stringify(customFontUrl)}); }`}</style>
      )}
      {fontHref && <link rel="stylesheet" href={fontHref} />}
      <header className={styles.header}>
        {artist.storefront.logoUrl ? (
          <img src={artist.storefront.logoUrl} alt={`${artist.name} Logo`} className={styles.logo} />
        ) : (
          <h1 className={styles.artistName}>{artist.name}</h1>
        )}
        <BasketBadge slug={slug} />
      </header>

      <main className={styles.main}>
        {isDropActive ? (
          <div className={styles.dropActive}>
            <div className={styles.banner}>
              <h2>{dropEnd && <CountdownTimer endTime={dropEnd.toISOString()} />}</h2>
              <p>Time left until this drop ends</p>
            </div>
            
            <ProductsSection slug={slug} />
          </div>
        ) : (
          <div className={styles.dropInactive}>
            <h2>Shop is Closed</h2>
            <p>
              {activeDrop && new Date(activeDrop.launchDate) > now 
                ? `Next drop opens on ${new Date(activeDrop.launchDate).toLocaleDateString()}`
                : "No active drops at the moment."}
            </p>
            <div className={styles.subscribe}>
              <input type="email" placeholder="Enter email to get notified" />
              <button>Notify Me</button>
            </div>
          </div>
        )}
      </main>

      {artist.storefront.story && (
        <section
          className={styles.story}
          style={{
            background: artist.storefront.storyBoxColor || undefined,
          }}
        >
          <h2
            className={styles.storyHeading}
            style={{ color: artist.storefront.storyTextColor || undefined }}
          >
            My Story
          </h2>
          <p style={{ color: artist.storefront.storyTextColor || undefined }}>
            {artist.storefront.story}
          </p>
        </section>
      )}

      {additionalImages.length > 0 && <ImageCarousel images={additionalImages} />}

      <SocialLinks
        youtubeUrl={artist.storefront.youtubeUrl}
        instagramUrl={artist.storefront.instagramUrl}
        facebookUrl={artist.storefront.facebookUrl}
        spotifyUrl={artist.storefront.spotifyUrl}
        tiktokUrl={artist.storefront.tiktokUrl}
      />

      <footer className={styles.footer}>
        <div className={styles.footerColumns}>
          {STOREFRONT_FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>{column.title}</h3>
              <ul className={styles.footerLinkList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.footerBottom}>Powered by Merchbooster</p>
      </footer>
    </div>
  );
}
