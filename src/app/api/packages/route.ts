import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function GET() {
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

  const packages = await prisma.merchPackage.findMany({
    where: { artistId: artist.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ packages });
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

  const { type, items, designConfigs } = await req.json();

  if (!type || !items) {
    return NextResponse.json({ error: "Package type and items are required" }, { status: 400 });
  }

  const merchPackage = await prisma.merchPackage.create({
    data: {
      artistId: artist.id,
      type,
      items: JSON.stringify(items),
      designConfigs: JSON.stringify(designConfigs ?? {}),
    },
  });

  return NextResponse.json({ success: true, package: merchPackage }, { status: 201 });
}
