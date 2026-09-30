import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { id: session.user.id },
    include: {
      drops: { include: { orders: true } },
      payouts: true,
    },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  if (!artist.bankAccountNumber) {
    return NextResponse.json({ error: "Add a bank account number in Personal Info before requesting a payout." }, { status: 400 });
  }

  const totalRevenue = artist.drops
    .flatMap((drop) => drop.orders)
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + order.totalAmount, 0);

  const totalPaidOut = artist.payouts.reduce((total, payout) => total + payout.amount, 0);
  const availableBalance = totalRevenue - totalPaidOut;

  if (availableBalance <= 0) {
    return NextResponse.json({ error: "No available balance to pay out." }, { status: 400 });
  }

  const payout = await prisma.payout.create({
    data: {
      artistId: artist.id,
      amount: availableBalance,
      bankAccountNumber: artist.bankAccountNumber,
    },
  });

  return NextResponse.json({ success: true, payout });
}
