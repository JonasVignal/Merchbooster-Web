"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function PersonalInfo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/artist")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setMessage(
            res.status === 401
              ? "Your session has expired. Please sign out and log in again."
              : data.error || "Failed to load personal info."
          );
          return;
        }
        if (data.artist) {
          setName(data.artist.name || "");
          setEmail(data.artist.email || "");
          setAddress(data.artist.address || "");
          setPhoneNumber(data.artist.phoneNumber || "");
          setBankAccountNumber(data.artist.bankAccountNumber || "");
        }
      })
      .catch(() => setMessage("Failed to load personal info."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/artist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, phoneNumber, bankAccountNumber }),
      });

      if (res.ok) {
        setMessage("Personal info saved successfully!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save personal info.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Personal Info</h1>
        <p className={styles.subtitle}>Your contact and payout details.</p>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@example.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, postal code"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+45 12 34 56 78"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="bankAccountNumber">Bank Account Number</label>
            <input
              type="text"
              id="bankAccountNumber"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="For receiving your payouts"
            />
          </div>

          {message && <p className={styles.message}>{message}</p>}

          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Personal Info"}
          </button>
        </form>
      </div>
    </div>
  );
}
