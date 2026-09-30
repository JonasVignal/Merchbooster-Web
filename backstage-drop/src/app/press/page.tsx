import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Press | Backstage Drop" };

export default function PressPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Press</h1>
      <p>
        Writing about artist merch, timed drops, or independent creator commerce? We'd love to help.
      </p>
      <h2>Media inquiries</h2>
      <p>
        For interviews, assets, or press inquiries, reach out to{" "}
        <a href="mailto:press@backstagedrop.dk">press@backstagedrop.dk</a>.
      </p>
    </div>
  );
}
