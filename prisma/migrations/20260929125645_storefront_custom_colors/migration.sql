-- Add the new custom color columns
ALTER TABLE "Storefront" ADD COLUMN "themeColorStart" TEXT NOT NULL DEFAULT '#168aad';
ALTER TABLE "Storefront" ADD COLUMN "themeColorEnd" TEXT;

-- Backfill from the old preset "themeColor" values so existing storefronts keep their look
UPDATE "Storefront" SET
  "themeColorStart" = CASE "themeColor"
    WHEN 'theme-1' THEN '#168aad'
    WHEN 'theme-2' THEN '#e27396'
    WHEN 'theme-3' THEN '#14110f'
    WHEN 'theme-4' THEN '#f29e4c'
    WHEN 'theme-5' THEN '#ba181b'
    ELSE '#168aad'
  END,
  "themeColorEnd" = CASE "themeColor"
    WHEN 'theme-1' THEN '#76c893'
    WHEN 'theme-2' THEN '#ea9ab2'
    WHEN 'theme-3' THEN '#34312d'
    WHEN 'theme-4' THEN '#f1c453'
    WHEN 'theme-5' THEN '#e5383b'
    ELSE '#76c893'
  END;

-- Drop the old preset column
ALTER TABLE "Storefront" DROP COLUMN "themeColor";
