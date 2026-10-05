import { resend, EMAIL_FROM } from "./resend";

// Hardcoded until a real admin notification setting exists.
const ADMIN_NOTIFICATION_EMAIL = "jonasvignal@gmail.com";

export async function sendOrderConfirmationEmail(
  order: {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    items: { name: string; price: number; quantity: number }[];
  },
  artistName: string | null
) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: [order.customerEmail, ADMIN_NOTIFICATION_EMAIL],
      subject: `Order confirmed — ${artistName ?? "Merchbooster"} #${order.id.slice(0, 8)}`,
      html: `
        <p>Hi ${order.customerName},</p>
        <p>Your order from ${artistName ?? "the artist"} has been received and is now pending.</p>
        <ul>
          ${order.items.map((item) => `<li>${item.name} × ${item.quantity} — ${item.price * item.quantity} DKK</li>`).join("")}
        </ul>
        <p><strong>Total: ${order.totalAmount.toFixed(2)} DKK</strong></p>
        <p>Order reference: ${order.id}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

export async function sendWelcomeEmail(to: string, name: string | null) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Welcome to Merchbooster",
      html: `
        <p>Hi ${name ?? "there"},</p>
        <p>Your Merchbooster account is ready. Head to your dashboard to set up your storefront, create a merch package, and schedule your first drop.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendDropEndedEmail(
  to: string,
  name: string | null,
  drop: { launchDate: Date; durationHours: number; packages: { type: string }[] },
  summary: { orderCount: number; totalSales: number }
) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Your drop has ended — sales summary",
      html: `
        <p>Hi ${name ?? "there"},</p>
        <p>Your drop that launched on ${drop.launchDate.toLocaleString()} (${drop.durationHours}h window) has ended.</p>
        <ul>
          <li>Packages: ${drop.packages.map((p) => p.type).join(", ") || "None"}</li>
          <li>Orders: ${summary.orderCount}</li>
          <li>Total sales: ${summary.totalSales.toFixed(2)} DKK</li>
        </ul>
      `,
    });
  } catch (error) {
    console.error("Failed to send drop-ended email:", error);
  }
}
