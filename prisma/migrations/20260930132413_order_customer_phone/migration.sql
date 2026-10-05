-- Add as nullable with a backfill default for existing rows, then enforce NOT NULL
ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ALTER COLUMN "customerPhone" DROP DEFAULT;
