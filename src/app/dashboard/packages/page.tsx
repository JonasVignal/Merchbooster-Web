"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const PACKAGES = [
  { id: "Medium", name: "Medium Package", items: ["T-Shirt", "Sticker"], desc: "Perfect for starting out." },
  { id: "Exclusive", name: "Exclusive Package", items: ["Hoodie", "T-Shirt", "Poster"], desc: "Most popular for fans." },
  { id: "Premium", name: "Premium Package", items: ["Hoodie", "Longsleeve", "Cap", "Poster"], desc: "The ultimate merch drop." }
];

type SavedPackage = {
  id: string;
  type: string;
  createdAt: string;
};

export default function PackageSelection() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isDesigning, setIsDesigning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPackages, setSavedPackages] = useState<SavedPackage[]>([]);

  // Dummy state for designs
  const [designs, setDesigns] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => setSavedPackages(data.packages ?? []))
      .catch(() => setSavedPackages([]));
  }, []);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    setIsDesigning(true);
  };

  const handleFileUpload = (item: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload for prototype
      const url = URL.createObjectURL(file);
      setDesigns(prev => ({ ...prev, [item]: url }));
    }
  };

  const handleSaveDesigns = async () => {
    if (!selectedPackage) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedPackage,
          items: PACKAGES.find((p) => p.id === selectedPackage)?.items ?? [],
          designConfigs: designs,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedPackages((prev) => [data.package, ...prev]);
        setIsDesigning(false);
        setSelectedPackage(null);
        setDesigns({});
        router.refresh();
      } else {
        alert("Failed to save merch package.");
      }
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Merch Packages</h1>
        <p className={styles.subtitle}>Select a package and design your items.</p>
      </header>

      {savedPackages.length > 0 && (
        <div className={styles.savedList}>
          <h2 className={styles.savedTitle}>Your Packages</h2>
          <ul className={styles.savedItems}>
            {savedPackages.map((pkg) => (
              <li key={pkg.id} className={styles.savedItem}>
                <span>{pkg.type}</span>
                <span className={styles.savedDate}>
                  {new Date(pkg.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isDesigning ? (
        <div className={styles.packageGrid}>
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className={styles.packageCard}>
              <h2>{pkg.name}</h2>
              <p className={styles.desc}>{pkg.desc}</p>
              <ul className={styles.itemsList}>
                {pkg.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <button 
                className={styles.selectBtn}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                Select & Design
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.designer}>
          <div className={styles.designerHeader}>
            <h2>Customizing: {PACKAGES.find(p => p.id === selectedPackage)?.name}</h2>
            <button className={styles.backBtn} onClick={() => setIsDesigning(false)}>
              &larr; Change Package
            </button>
          </div>
          
          <div className={styles.itemsGrid}>
            {PACKAGES.find(p => p.id === selectedPackage)?.items.map(item => (
              <div key={item} className={styles.designCard}>
                <h3>{item}</h3>
                <div className={styles.previewArea}>
                  {designs[item] ? (
                    <img src={designs[item]} alt={`${item} design`} />
                  ) : (
                    <div className={styles.placeholder}>No design uploaded</div>
                  )}
                </div>
                <label className={styles.uploadBtn}>
                  Upload Artwork
                  <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(item, e)} />
                </label>
              </div>
            ))}
          </div>

          <button className={styles.saveBtn} onClick={handleSaveDesigns} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Designs"}
          </button>
        </div>
      )}
    </div>
  );
}
