"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export function DeleteArtistButton({ id, name }: { id: string; name: string | null }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${name || "this artist"}'s account? This permanently removes their storefront, drops, orders, and payout history. This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete artist.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button type="button" onClick={handleDelete} className={styles.deleteBtn} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
