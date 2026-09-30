import styles from "./page.module.css";
import Link from "next/link";

const features = [
  {
    title: "Branded Storefront",
    desc: "Choose from 5 curated color themes, pick your typography, and upload your logo to create a storefront that's unmistakably yours.",
  },
  {
    title: "Merch Packages",
    desc: "Select from Medium, Exclusive, or Premium packages. Upload your artwork for each item and let us handle the rest.",
  },
  {
    title: "Timed Drops",
    desc: "Schedule your launch date and set a 24–96 hour sale window. The shop opens and closes automatically.",
  },
  {
    title: "Instant Checkout",
    desc: "Fans can buy directly from your personalized storefront page. Fast, seamless, and fully branded.",
  },
];

const artistExamples = [
  { name: "Tobias Rahim", slug: "tobias-rahim", theme: "theme-2" },
  { name: "Oh Land", slug: "oh-land", theme: "theme-4" },
  { name: "Suspekt", slug: "suspekt", theme: "theme-1" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>Merchbooster</span>
        <div className={styles.navLinks}>
          <Link href="/login">Artist Login</Link>
          <Link href="/register" className={styles.navCta}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          The Merch Platform<br />
          <span className={styles.heroHighlight}>Built for Artists</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Create your branded storefront, design exclusive merch packages, and launch timed drops that sell out in hours — not months.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/register" className={styles.ctaPrimary}>
            Start for Free →
          </Link>
          <Link href="/login" className={styles.ctaSecondary}>
            Artist Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <h2 className={styles.sectionTitle}>Everything you need to drop merch</h2>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <h3>Create your account</h3>
            <p>Sign up as an artist in under a minute.</p>
          </div>
          <div className={styles.stepConnector} />
          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <h3>Design your storefront</h3>
            <p>Pick a theme, upload your logo, and choose your merch package.</p>
          </div>
          <div className={styles.stepConnector} />
          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <h3>Schedule the drop</h3>
            <p>Set a launch time and 24–96 hour window for the sale.</p>
          </div>
          <div className={styles.stepConnector} />
          <div className={styles.step}>
            <div className={styles.stepNumber}>04</div>
            <h3>Fans shop & you earn</h3>
            <p>Your branded page goes live — fans buy, you get paid.</p>
          </div>
        </div>
      </section>

      {/* Artist examples */}
      <section className={styles.examples}>
        <h2 className={styles.sectionTitle}>Artist storefronts, made unique</h2>
        <div className={styles.examplesGrid}>
          {artistExamples.map((a) => (
            <Link key={a.slug} href={`/${a.slug}`} className={`${styles.exampleCard} ${styles[a.theme]}`}>
              <div className={styles.exampleName}>{a.name}</div>
              <div className={styles.exampleCta}>View Drop →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <h2>Ready to drop your merch?</h2>
        <p>Join hundreds of artists already using Merchbooster.</p>
        <Link href="/register" className={styles.ctaPrimary}>
          Create Your Storefront
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Merchbooster</div>
        <p className={styles.footerText}>© 2026 Merchbooster. All rights reserved.</p>
      </footer>
    </div>
  );
}
