"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const CARD_SIZE = 400;
const CARD_GAP = 24;

export function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  const offset = index * (CARD_SIZE + CARD_GAP) + CARD_SIZE / 2;

  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(calc(50% - ${offset}px))` }}
      >
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            className={`${styles.carouselCard} ${i === index ? styles.carouselCardActive : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
          >
            <img src={url} alt={`Storefront image ${i + 1}`} className={styles.carouselImage} />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Next image"
          >
            ›
          </button>

          <div className={styles.carouselDots}>
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
