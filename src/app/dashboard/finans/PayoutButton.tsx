"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export function PayoutButton({ availableBalance, hasBankAccount }: { availableBalance: number; hasBankAccount: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayout = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/payout", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Payout of ${data.payout.amount.toFixed(2)} DKK sent to your bank account.`);
        router.refresh();
      } else {
        setMessage(data.error || "Failed to request payout.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || !hasBankAccount || availableBalance <= 0;

  return (
    <div className={styles.payoutAction}>
      <button type="button" className={styles.payoutBtn} onClick={handlePayout} disabled={disabled}>
        {isSubmitting ? "Processing..." : "Payout"}
      </button>
      {!hasBankAccount && <p className={styles.meta}>Add a bank account in Personal Info to enable payouts.</p>}
      {hasBankAccount && availableBalance <= 0 && <p className={styles.meta}>No available balance to pay out.</p>}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
