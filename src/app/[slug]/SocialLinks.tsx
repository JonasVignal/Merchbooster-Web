import styles from "./page.module.css";

const ICONS: Record<string, React.ReactNode> = {
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2 .25 2.5.42a5 5 0 0 1 1.8 1.2 5 5 0 0 1 1.2 1.8c.17.5.36 1.3.42 2.5.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 2-.42 2.5a5 5 0 0 1-1.2 1.8 5 5 0 0 1-1.8 1.2c-.5.17-1.3.36-2.5.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2-.25-2.5-.42a5 5 0 0 1-1.8-1.2 5 5 0 0 1-1.2-1.8c-.17-.5-.36-1.3-.42-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-2 .42-2.5a5 5 0 0 1 1.2-1.8 5 5 0 0 1 1.8-1.2c.5-.17 1.3-.36 2.5-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6Zm6.9-11.1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.8.2c-2.3-1.4-5.1-1.7-8.5-1a.6.6 0 1 1-.3-1.2c3.7-.8 6.9-.5 9.4 1a.6.6 0 0 1 .2.8v.2Zm1.2-2.8a.75.75 0 0 1-1 .3c-2.6-1.6-6.6-2.1-9.7-1.1a.75.75 0 1 1-.5-1.4c3.5-1.1 7.9-.6 10.9 1.2.4.2.5.7.3 1Zm.1-2.9C14.6 8.9 9.4 8.7 6.4 9.6a.9.9 0 1 1-.5-1.7c3.5-1.1 9.2-.9 12.8 1.3a.9.9 0 0 1-.8 1.5Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M16.6 2h-3.2v13.9a2.9 2.9 0 1 1-2.1-2.8v-3.3a6.2 6.2 0 1 0 5.3 6.1V9.1a8 8 0 0 0 4.9 1.7V7.6a4.8 4.8 0 0 1-4.9-4.8V2Z" />
    </svg>
  ),
};

const LABELS: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  spotify: "Spotify",
  tiktok: "TikTok",
};

export function SocialLinks({
  youtubeUrl,
  instagramUrl,
  facebookUrl,
  spotifyUrl,
  tiktokUrl,
}: {
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  spotifyUrl?: string | null;
  tiktokUrl?: string | null;
}) {
  const links: { key: string; url: string }[] = [
    { key: "youtube", url: youtubeUrl ?? "" },
    { key: "instagram", url: instagramUrl ?? "" },
    { key: "facebook", url: facebookUrl ?? "" },
    { key: "spotify", url: spotifyUrl ?? "" },
    { key: "tiktok", url: tiktokUrl ?? "" },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className={styles.socialLinks}>
      {links.map(({ key, url }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={LABELS[key]}
        >
          {ICONS[key]}
        </a>
      ))}
    </div>
  );
}
