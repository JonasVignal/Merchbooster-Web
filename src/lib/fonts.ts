export const GOOGLE_FONTS = [
  { name: "Inter", label: "Inter (Modern Sans)", googleParam: "Inter:wght@400;600;700" },
  { name: "Roboto", label: "Roboto (Clean)", googleParam: "Roboto:wght@400;500;700" },
  { name: "Outfit", label: "Outfit (Geometric)", googleParam: "Outfit:wght@400;600;800" },
  { name: "Playfair Display", label: "Playfair Display (Elegant Serif)", googleParam: "Playfair+Display:wght@400;700;800" },
  { name: "Poppins", label: "Poppins (Rounded)", googleParam: "Poppins:wght@400;600;700" },
  { name: "Montserrat", label: "Montserrat (Bold Sans)", googleParam: "Montserrat:wght@400;600;800" },
  { name: "Space Grotesk", label: "Space Grotesk (Techy)", googleParam: "Space+Grotesk:wght@400;600;700" },
  { name: "DM Sans", label: "DM Sans (Minimal)", googleParam: "DM+Sans:wght@400;500;700" },
  { name: "Work Sans", label: "Work Sans (Neutral)", googleParam: "Work+Sans:wght@400;600;700" },
  { name: "Bebas Neue", label: "Bebas Neue (Bold Display)", googleParam: "Bebas+Neue" },
  { name: "Lora", label: "Lora (Elegant Serif)", googleParam: "Lora:wght@400;600;700" },
  { name: "Oswald", label: "Oswald (Condensed)", googleParam: "Oswald:wght@400;600;700" },
] as const;

export function googleFontHref(fontName: string): string | null {
  const preset = GOOGLE_FONTS.find((f) => f.name === fontName);
  if (!preset) return null;
  return `https://fonts.googleapis.com/css2?family=${preset.googleParam}&display=swap`;
}
