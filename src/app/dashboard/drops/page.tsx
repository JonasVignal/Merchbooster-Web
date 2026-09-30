"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type SavedPackage = {
  id: string;
  type: string;
  createdAt: string;
};

export default function DropSchedule() {
  const [packages, setPackages] = useState<SavedPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [launchDate, setLaunchDate] = useState("");
  const [launchTime, setLaunchTime] = useState("");
  const [duration, setDuration] = useState(24);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data.packages ?? []))
      .catch(() => setPackages([]))
      .finally(() => setIsLoadingPackages(false));
  }, []);

  const togglePackage = (id: string) => {
    setSelectedPackageIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!launchDate || !launchTime) {
      setMessage("Please select a valid launch date and time.");
      return;
    }

    if (selectedPackageIds.length === 0) {
      setMessage("Select at least one merch package to include in the drop.");
      return;
    }

    setIsSaving(true);

    try {
      const dateTimeString = `${launchDate}T${launchTime}:00`;
      const res = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          launchDate: dateTimeString,
          durationHours: duration,
          packageIds: selectedPackageIds,
        }),
      });

      if (res.ok) {
        setMessage("Drop scheduled successfully!");
        setSelectedPackageIds([]);
        setLaunchDate("");
        setLaunchTime("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to schedule drop.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingPackages) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Drop Schedule</h1>
        </header>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Drop Schedule</h1>
          <p className={styles.subtitle}>Set when your merch drops and how long it stays available.</p>
        </header>

        <div className={styles.card}>
          <p className={styles.message}>
            You need to create a merch package before you can schedule a drop.
          </p>
          <a href="/dashboard/packages" className={styles.saveBtn}>
            Create a Package &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Drop Schedule</h1>
        <p className={styles.subtitle}>Choose which package drops, and when.</p>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Merch Package</label>
            <div className={styles.packageOptions}>
              {packages.map((pkg) => (
                <label key={pkg.id} className={styles.packageOption}>
                  <input
                    type="checkbox"
                    checked={selectedPackageIds.includes(pkg.id)}
                    onChange={() => togglePackage(pkg.id)}
                  />
                  {pkg.type}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="launchDate">Launch Date</label>
            <input
              type="date"
              id="launchDate"
              required
              value={launchDate}
              onChange={(e) => setLaunchDate(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="launchTime">Launch Time</label>
            <input
              type="time"
              id="launchTime"
              required
              value={launchTime}
              onChange={(e) => setLaunchTime(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="duration">Sale Duration (Hours)</label>
            <div className={styles.durationControl}>
              <input
                type="range"
                id="duration"
                min="24"
                max="96"
                step="24"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
              <span className={styles.durationValue}>{duration} Hours</span>
            </div>
          </div>

          {message && <p className={styles.message}>{message}</p>}

          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? "Scheduling..." : "Schedule Drop"}
          </button>
        </form>
      </div>
    </div>
  );
}
