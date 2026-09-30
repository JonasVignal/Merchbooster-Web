-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "slug" TEXT,
    "setupCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storefront" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "themeColor" TEXT NOT NULL DEFAULT 'theme-1',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "logoUrl" TEXT,
    "additionalImages" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storefront_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchPackage" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "designConfigs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "durationHours" INTEGER NOT NULL DEFAULT 24,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Storefront_artistId_key" ON "Storefront"("artistId");

-- AddForeignKey
ALTER TABLE "Storefront" ADD CONSTRAINT "Storefront_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchPackage" ADD CONSTRAINT "MerchPackage_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
