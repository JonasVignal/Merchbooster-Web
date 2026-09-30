import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
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

    const { launchDate, durationHours, packageIds } = await req.json();

    if (!Array.isArray(packageIds) || packageIds.length === 0) {
      return NextResponse.json(
        { error: "Select at least one merch package to drop" },
        { status: 400 }
      );
    }

    const ownedPackages = await prisma.merchPackage.findMany({
      where: { id: { in: packageIds }, artistId: artist.id },
      select: { id: true },
    });

    if (ownedPackages.length !== packageIds.length) {
      return NextResponse.json(
        { error: "One or more selected packages could not be found" },
        { status: 400 }
      );
    }

    const drop = await prisma.drop.create({
      data: {
        artistId: artist.id,
        launchDate: new Date(launchDate),
        durationHours: parseInt(durationHours),
        status: "scheduled",
        packages: { connect: packageIds.map((id: string) => ({ id })) },
      },
      include: { packages: true },
    });

    return NextResponse.json({ success: true, drop });
  } catch (error) {
    console.error("Drop scheduling error:", error);
    return NextResponse.json({ error: "Failed to schedule drop" }, { status: 500 });
  }
}
