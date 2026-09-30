"use client";

import { useRef } from "react";
import styles from "./page.module.css";

export function Carousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={styles.carousel}>
      <button
        type="button"
        className={styles.carouselArrow}
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div className={styles.carouselTrack} ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className={styles.carouselArrow}
        onClick={() => scroll(1)}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}
