import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

const MAX_ADDITIONAL_IMAGES = 5;

function withParsedImages<T extends { additionalImages: string | null }>(storefront: T) {
  return {
    ...storefront,
    additionalImages: storefront.additionalImages ? JSON.parse(storefront.additionalImages) : [],
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { email: session.user.email },
    include: { storefront: true },
  });

  return NextResponse.json({
    storefront: artist?.storefront ? withParsedImages(artist.storefront) : null,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { email: session.user.email },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  const { themeColorStart, themeColorEnd, font, customFontUrl, logoUrl, additionalImages } = await req.json();

  const hexColor = /^#[0-9a-fA-F]{6}$/;
  if (!hexColor.test(themeColorStart)) {
    return NextResponse.json({ error: "Invalid primary color" }, { status: 400 });
  }
  if (themeColorEnd && !hexColor.test(themeColorEnd)) {
    return NextResponse.json({ error: "Invalid secondary color" }, { status: 400 });
  }

  if (additionalImages && (!Array.isArray(additionalImages) || additionalImages.length > MAX_ADDITIONAL_IMAGES)) {
    return NextResponse.json({ error: `You can upload up to ${MAX_ADDITIONAL_IMAGES} images` }, { status: 400 });
  }

  const additionalImagesJson = additionalImages?.length ? JSON.stringify(additionalImages) : null;

  const storefront = await prisma.storefront.upsert({
    where: { artistId: artist.id },
    update: { themeColorStart, themeColorEnd: themeColorEnd || null, font, customFontUrl: customFontUrl || null, logoUrl, additionalImages: additionalImagesJson },
    create: { artistId: artist.id, themeColorStart, themeColorEnd: themeColorEnd || null, font, customFontUrl: customFontUrl || null, logoUrl, additionalImages: additionalImagesJson },
  });

  // Mark setup as completed if it wasn't
  if (!artist.setupCompleted) {
    await prisma.artist.update({
      where: { id: artist.id },
      data: { setupCompleted: true },
    });
  }

  return NextResponse.json({ success: true, storefront: withParsedImages(storefront) });
}
