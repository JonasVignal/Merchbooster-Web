"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

function formatRemaining(ms: number) {
  if (ms <= 0) return "Closed";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownBadge({ endTime }: { endTime: string }) {
  const [remaining, setRemaining] = useState(() => new Date(endTime).getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(new Date(endTime).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return <span className={styles.countdown}>{formatRemaining(remaining)}</span>;
}
