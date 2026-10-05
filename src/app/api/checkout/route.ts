import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getProduct } from "../../../lib/products";
import { sendOrderConfirmationEmail } from "../../../lib/email";

export async function POST(req: Request) {
  const { dropId, customerName, customerEmail, customerPhone, shippingAddress, items } = await req.json();

  if (!dropId || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty" }, { status: 400 });
  }

  const drop = await prisma.drop.findUnique({ where: { id: dropId }, include: { artist: true } });
  if (!drop) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  const launch = new Date(drop.launchDate);
  const end = new Date(launch.getTime() + drop.durationHours * 60 * 60 * 1000);
  const now = new Date();
  if (now < launch || now > end) {
    return NextResponse.json({ error: "This drop is no longer active" }, { status: 400 });
  }

  // Recompute items and total server-side from the known catalog — never trust client-sent prices.
  const orderItems: { id: string; name: string; price: number; quantity: number }[] = [];
  let totalAmount = 0;

  for (const { id, quantity } of items) {
    const product = getProduct(id);
    const qty = Number(quantity);
    if (!product || !Number.isInteger(qty) || qty <= 0) {
      return NextResponse.json({ error: "Invalid item in basket" }, { status: 400 });
    }
    orderItems.push({ id: product.id, name: product.name, price: product.price, quantity: qty });
    totalAmount += product.price * qty;
  }

  const order = await prisma.order.create({
    data: {
      dropId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(orderItems),
      totalAmount,
      paymentStatus: "pending",
    },
  });

  await sendOrderConfirmationEmail(
    { id: order.id, customerName, customerEmail, totalAmount, items: orderItems },
    drop.artist.name
  );

  return NextResponse.json({ success: true, orderId: order.id });
}
