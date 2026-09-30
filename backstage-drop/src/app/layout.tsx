import type { Metadata } from "next";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backstage Drop | Discover Artist Merch Drops",
  description: "Backstage Drop hosts every artist storefront and merch drop created with Merchbooster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.page}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
