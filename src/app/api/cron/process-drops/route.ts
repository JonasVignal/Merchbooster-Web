import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendDropEndedEmail } from "../../../../lib/email";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const candidates = await prisma.drop.findMany({
    where: { status: { not: "ended" } },
    include: { artist: true, packages: true, orders: true },
  });

  const endedDrops = candidates.filter(
    (drop) => new Date(drop.launchDate.getTime() + drop.durationHours * 60 * 60 * 1000) < now
  );

  for (const drop of endedDrops) {
    const paidOrders = drop.orders.filter((order) => order.paymentStatus === "paid");
    const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    await prisma.drop.update({
      where: { id: drop.id },
      data: { status: "ended" },
    });

    await sendDropEndedEmail(drop.artist.email, drop.artist.name, drop, {
      orderCount: paidOrders.length,
      totalSales,
    });
  }

  return NextResponse.json({ processed: endedDrops.length });
}
