import { googleFontHref } from "./fonts";

function brightness(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function getStorefrontTheme(storefront: {
  themeColorStart: string;
  themeColorEnd: string | null;
  font: string;
  customFontUrl: string | null;
}) {
  const { themeColorStart, themeColorEnd, font, customFontUrl } = storefront;

  const background = themeColorEnd
    ? `linear-gradient(180deg, ${themeColorStart}, ${themeColorEnd})`
    : themeColorStart;

  const avgBrightness = themeColorEnd
    ? (brightness(themeColorStart) + brightness(themeColorEnd)) / 2
    : brightness(themeColorStart);
  const needsDarkText = avgBrightness > 150;

  const fontFamily = customFontUrl ? "StorefrontCustomFont" : font;
  const fontHref = customFontUrl ? null : googleFontHref(font);

  return { background, needsDarkText, fontFamily, fontHref, customFontUrl };
}
