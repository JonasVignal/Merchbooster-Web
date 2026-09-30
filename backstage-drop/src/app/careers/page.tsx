import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Careers | Backstage Drop" };

export default function CareersPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Careers</h1>
      <p>
        We're not currently hiring, but Backstage Drop is growing alongside the artists and fans who use it.
        Check back here for future openings.
      </p>
      <p>
        In the meantime, if you're passionate about artist-led commerce and want to reach out, email us at{" "}
        <a href="mailto:careers@backstagedrop.dk">careers@backstagedrop.dk</a>.
      </p>
    </div>
  );
}
