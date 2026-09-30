import { resend, EMAIL_FROM } from "./resend";

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
