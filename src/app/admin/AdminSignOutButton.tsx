"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export function AdminSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button type="button" onClick={handleSignOut} className={styles.signOutBtn}>
      Sign Out
    </button>
  );
}
