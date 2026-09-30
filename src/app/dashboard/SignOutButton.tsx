"use client";

import { signOut } from "next-auth/react";
import styles from "./layout.module.css";

export function SignOutButton() {
  return (
    <button
      className={styles.signOutBtn}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Sign Out
    </button>
  );
}
