import Link from "next/link";
import { FOOTER_COLUMNS } from "../lib/site";
import styles from "./layout.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerColumns}>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>{column.title}</h3>
            <ul className={styles.footerLinkList}>
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") || link.href === "#" ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={styles.footerBottom}>Backstage Drop is powered by Merchbooster.</p>
    </footer>
  );
}
