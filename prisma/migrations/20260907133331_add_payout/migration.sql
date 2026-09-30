-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
