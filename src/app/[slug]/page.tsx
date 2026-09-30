import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { CountdownTimer } from "./CountdownTimer";
import { ImageCarousel } from "./ImageCarousel";
import { googleFontHref } from "../../lib/fonts";
import styles from "./page.module.css";

function brightness(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

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

  const { themeColorStart, themeColorEnd } = artist.storefront;
  const background = themeColorEnd
    ? `linear-gradient(135deg, ${themeColorStart}, ${themeColorEnd})`
    : themeColorStart;

  const avgBrightness = themeColorEnd
    ? (brightness(themeColorStart) + brightness(themeColorEnd)) / 2
    : brightness(themeColorStart);
  const needsDarkText = avgBrightness > 150;

  const { customFontUrl } = artist.storefront;
  const fontFamily = customFontUrl ? "StorefrontCustomFont" : artist.storefront.font;
  const fontHref = customFontUrl ? null : googleFontHref(artist.storefront.font);

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
      </header>

      <main className={styles.main}>
        {isDropActive ? (
          <div className={styles.dropActive}>
            <div className={styles.banner}>
              <h2>{dropEnd && <CountdownTimer endTime={dropEnd.toISOString()} />}</h2>
              <p>Time left until this drop ends</p>
            </div>
            
            <div className={styles.productsGrid}>
              {/* Dummy Products for prototype */}
              <div className={styles.productCard}>
                <div className={styles.productImagePlaceholder}>Exclusive Hoodie</div>
                <div className={styles.productInfo}>
                  <h3>Exclusive Hoodie</h3>
                  <p>650 DKK</p>
                  <button className={styles.buyBtn}>Drop in Basket</button>
                </div>
              </div>
              
              <div className={styles.productCard}>
                <div className={styles.productImagePlaceholder}>T-Shirt</div>
                <div className={styles.productInfo}>
                  <h3>Classic T-Shirt</h3>
                  <p>300 DKK</p>
                  <button className={styles.buyBtn}>Drop in Basket</button>
                </div>
              </div>
            </div>
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

      <footer className={styles.footer}>
        <p>Powered by Merchbooster</p>
      </footer>
    </div>
  );
}
