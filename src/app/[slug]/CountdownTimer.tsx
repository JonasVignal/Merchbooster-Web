"use client";

import { useEffect, useState } from "react";

function getRemaining(endTime: number) {
  const diff = Math.max(0, endTime - Date.now());
  return {
    diff,
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CountdownTimer({ endTime }: { endTime: string }) {
  const end = new Date(endTime).getTime();
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(end));
    const interval = setInterval(() => setRemaining(getRemaining(end)), 1000);
    return () => clearInterval(interval);
  }, [end]);

  if (!remaining) {
    return <>--:--:--</>;
  }

  if (remaining.diff <= 0) {
    return <>Drop has ended</>;
  }

  return (
    <>
      {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
    </>
  );
}
