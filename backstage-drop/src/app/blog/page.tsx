import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Blog | Backstage Drop" };

export default function BlogPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Blog</h1>
      <p>
        We're just getting started — stories about the artists on Backstage Drop, drop announcements, and
        behind-the-scenes updates will show up here soon.
      </p>
    </div>
  );
}
