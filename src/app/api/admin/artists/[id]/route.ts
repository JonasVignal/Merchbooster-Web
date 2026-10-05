import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "../../../../../lib/admin-auth";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const artist = await prisma.artist.findUnique({ where: { id } });
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  // Orders aren't cascade-deleted from Drop, so they must go first —
  // everything else (Drops, Storefront, MerchPackages, Payouts) cascades from the Artist delete.
  await prisma.$transaction([
    prisma.order.deleteMany({ where: { drop: { artistId: id } } }),
    prisma.artist.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
