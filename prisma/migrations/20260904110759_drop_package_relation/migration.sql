-- CreateTable
CREATE TABLE "_DropToMerchPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DropToMerchPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DropToMerchPackage_B_index" ON "_DropToMerchPackage"("B");

-- AddForeignKey
ALTER TABLE "_DropToMerchPackage" ADD CONSTRAINT "_DropToMerchPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropToMerchPackage" ADD CONSTRAINT "_DropToMerchPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "MerchPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
