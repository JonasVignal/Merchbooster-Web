"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { GOOGLE_FONTS, googleFontHref } from "../../../lib/fonts";

const MAX_ADDITIONAL_IMAGES = 5;
const MAX_STORY_LENGTH = 2300;

export default function StorefrontSettings() {
  const [themeColorStart, setThemeColorStart] = useState("#168aad");
  const [themeColorEnd, setThemeColorEnd] = useState<string | null>("#76c893");
  const [font, setFont] = useState("Inter");
  const [customFontUrl, setCustomFontUrl] = useState("");
  const [customFontName, setCustomFontName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [storyBoxColor, setStoryBoxColor] = useState("#0d0d0d");
  const [storyTextColor, setStoryTextColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFont, setIsUploadingFont] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/storefront")
      .then((res) => res.json())
      .then((data) => {
        if (data.storefront) {
          setThemeColorStart(data.storefront.themeColorStart || "#168aad");
          setThemeColorEnd(data.storefront.themeColorEnd || null);
          setFont(data.storefront.font || "Inter");
          setCustomFontUrl(data.storefront.customFontUrl || "");
          setLogoUrl(data.storefront.logoUrl || "");
          setAdditionalImages(data.storefront.additionalImages || []);
          setStory(data.storefront.story || "");
          setStoryBoxColor(data.storefront.storyBoxColor || "#0d0d0d");
          setStoryTextColor(data.storefront.storyTextColor || "#ffffff");
        }
        setIsLoading(false);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setLogoUrl(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFont(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setCustomFontUrl(data.url);
        setCustomFontName(file.name);
      }
    } catch (err) {
      console.error("Font upload failed", err);
    } finally {
      setIsUploadingFont(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = MAX_ADDITIONAL_IMAGES - additionalImages.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploadingImages(true);
    try {
      const uploaded: string[] = [];
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) uploaded.push(data.url);
      }
      setAdditionalImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Gallery upload failed", err);
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeAdditionalImage = (url: string) => {
    setAdditionalImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/storefront", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeColorStart, themeColorEnd, font, customFontUrl, logoUrl, additionalImages, story, storyBoxColor, storyTextColor }),
      });

      if (res.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      setMessage("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Storefront Settings</h1>
        <p className={styles.subtitle}>Customize the look and feel of your drop page.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h2>1. Theme Color</h2>
          <p className={styles.hint}>Pick a color, and optionally a second one to blend into a gradient.</p>
          <div className={styles.colorRow}>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={themeColorStart}
                onChange={(e) => setThemeColorStart(e.target.value)}
                className={styles.colorInput}
                aria-label="Primary color"
              />
              <span className={styles.colorLabel}>Color 1</span>
            </div>

            {themeColorEnd !== null ? (
              <div className={styles.colorPicker}>
                <input
                  type="color"
                  value={themeColorEnd}
                  onChange={(e) => setThemeColorEnd(e.target.value)}
                  className={styles.colorInput}
                  aria-label="Secondary color"
                />
                <span className={styles.colorLabel}>Color 2</span>
                <button type="button" className={styles.removeColorBtn} onClick={() => setThemeColorEnd(null)}>
                  Remove
                </button>
              </div>
            ) : (
              <button type="button" className={styles.addColorBtn} onClick={() => setThemeColorEnd("#76c893")}>
                + Add second color
              </button>
            )}
          </div>

          <div
            className={styles.themePreview}
            style={{
              background: themeColorEnd
                ? `linear-gradient(135deg, ${themeColorStart}, ${themeColorEnd})`
                : themeColorStart,
            }}
          />
        </div>

        <div className={styles.section}>
          <h2>2. Typography</h2>

          <select
            value={font}
            onChange={(e) => {
              setFont(e.target.value);
              setCustomFontUrl("");
              setCustomFontName("");
            }}
            className={styles.select}
          >
            {GOOGLE_FONTS.map((f) => (
              <option key={f.name} value={f.name}>{f.label}</option>
            ))}
          </select>

          <p className={styles.hint}>Or upload your own font file (.ttf, .otf, .woff, .woff2).</p>
          <div className={styles.uploadArea}>
            {customFontUrl ? (
              <div className={styles.logoPreview}>
                <p className={styles.fontFileName}>{customFontName || "Custom font uploaded"}</p>
                <button
                  type="button"
                  onClick={() => { setCustomFontUrl(""); setCustomFontName(""); }}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <span>{isUploadingFont ? "Uploading..." : "Click to upload a font"}</span>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
                  onChange={handleFontUpload}
                  hidden
                  disabled={isUploadingFont}
                />
              </label>
            )}
          </div>

          {customFontUrl && (
            <>
              <style>{`@font-face { font-family: "StorefrontFontPreview"; src: url(${JSON.stringify(customFontUrl)}); }`}</style>
              <p className={styles.fontPreview} style={{ fontFamily: "StorefrontFontPreview" }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </>
          )}
          {!customFontUrl && (
            <>
              <link rel="stylesheet" href={googleFontHref(font) ?? undefined} />
              <p className={styles.fontPreview} style={{ fontFamily: font }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </>
          )}
        </div>

        <div className={styles.section}>
          <h2>3. Brand Logo</h2>
          <div className={styles.uploadArea}>
            {logoUrl ? (
              <div className={styles.logoPreview}>
                <img src={logoUrl} alt="Brand Logo" />
                <button type="button" onClick={() => setLogoUrl("")} className={styles.removeBtn}>Remove</button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <span>Click to upload logo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>4. Storefront Images</h2>
          <p className={styles.hint}>
            Upload up to {MAX_ADDITIONAL_IMAGES} images to show as a carousel on your storefront ({additionalImages.length}/{MAX_ADDITIONAL_IMAGES}).
          </p>

          {additionalImages.length > 0 && (
            <div className={styles.galleryGrid}>
              {additionalImages.map((url) => (
                <div key={url} className={styles.galleryItem}>
                  <img src={url} alt="Storefront gallery image" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(url)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {additionalImages.length < MAX_ADDITIONAL_IMAGES && (
            <div className={styles.uploadArea}>
              <label className={styles.uploadLabel}>
                <span>{isUploadingImages ? "Uploading..." : "Click to upload images"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  hidden
                  disabled={isUploadingImages}
                />
              </label>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>5. Your Story</h2>
          <p className={styles.hint}>
            Tell your fans about yourself. This shows up on your storefront above the picture carousel.
          </p>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value.slice(0, MAX_STORY_LENGTH))}
            maxLength={MAX_STORY_LENGTH}
            rows={8}
            placeholder="Share your story..."
            className={styles.textarea}
          />
          <p className={styles.charCount}>
            {story.length}/{MAX_STORY_LENGTH}
          </p>

          <p className={styles.hint}>Choose the box color and text color for your story.</p>
          <div className={styles.colorRow}>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={storyBoxColor}
                onChange={(e) => setStoryBoxColor(e.target.value)}
                className={styles.colorInput}
                aria-label="Story box color"
              />
              <span className={styles.colorLabel}>Box Color</span>
            </div>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={storyTextColor}
                onChange={(e) => setStoryTextColor(e.target.value)}
                className={styles.colorInput}
                aria-label="Story text color"
              />
              <span className={styles.colorLabel}>Text Color</span>
            </div>
          </div>

          <div className={styles.storyPreview} style={{ background: storyBoxColor, color: storyTextColor }}>
            <h3 className={styles.storyPreviewHeading}>My Story</h3>
            <p>{story || "Your story preview will show up here."}</p>
          </div>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Storefront Settings"}
        </button>
      </form>
    </div>
  );
}
