import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { getStorefrontTheme } from "../../../lib/theme";
import { BasketClient } from "./BasketClient";
import pageStyles from "../page.module.css";
import styles from "./page.module.css";

export default async function BasketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      storefront: true,
      drops: { orderBy: { launchDate: "desc" }, take: 1 },
    },
  });

  if (!artist || !artist.storefront) {
    notFound();
  }

  const activeDrop = artist.drops[0];
  const now = new Date();
  let isDropActive = false;
  if (activeDrop) {
    const launch = new Date(activeDrop.launchDate);
    const end = new Date(launch.getTime() + activeDrop.durationHours * 60 * 60 * 1000);
    isDropActive = now >= launch && now <= end;
  }

  const { background, needsDarkText, fontFamily, fontHref, customFontUrl } = getStorefrontTheme(
    artist.storefront
  );

  return (
    <div
      className={`${pageStyles.container} ${needsDarkText ? pageStyles.darkText : ""}`}
      style={{ fontFamily, background }}
    >
      {customFontUrl && (
        <style>{`@font-face { font-family: "StorefrontCustomFont"; src: url(${JSON.stringify(customFontUrl)}); }`}</style>
      )}
      {fontHref && <link rel="stylesheet" href={fontHref} />}

      <header className={pageStyles.header}>
        {artist.storefront.logoUrl ? (
          <img src={artist.storefront.logoUrl} alt={`${artist.name} Logo`} className={pageStyles.logo} />
        ) : (
          <h1 className={pageStyles.artistName}>{artist.name}</h1>
        )}
      </header>

      <main className={styles.main}>
        <Link href={`/${slug}`} className={styles.backLink}>← Back to shop</Link>
        <h1 className={styles.title}>Your Basket</h1>
        <BasketClient slug={slug} isDropActive={isDropActive} />
      </main>
    </div>
  );
}
