import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      fullName: true,
      email: true,
      address: true,
      phoneNumber: true,
      bankAccountNumber: true,
    },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  return NextResponse.json({ artist });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, fullName, email, address, phoneNumber, bankAccountNumber } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const artist = await prisma.artist.update({
      where: { id: session.user.id },
      data: { name, fullName, email, address, phoneNumber, bankAccountNumber },
      select: {
        name: true,
        fullName: true,
        email: true,
        address: true,
        phoneNumber: true,
        bankAccountNumber: true,
      },
    });

    return NextResponse.json({ success: true, artist });
  } catch {
    return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
  }
}
