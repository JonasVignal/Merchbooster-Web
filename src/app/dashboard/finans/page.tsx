import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import { PayoutButton } from "./PayoutButton";

export default async function Finans() {
  const session = await getServerSession(authOptions);

  const artist = session?.user?.email
    ? await prisma.artist.findUnique({
        where: { email: session.user.email },
        include: {
          drops: { include: { orders: true } },
          payouts: { orderBy: { createdAt: "desc" } },
        },
      })
    : null;

  const drops = artist?.drops ?? [];
  const orders = drops.flatMap((drop) => drop.orders);
  const payouts = artist?.payouts ?? [];

  const sum = (status: string) =>
    orders.filter((order) => order.paymentStatus === status).reduce((total, order) => total + order.totalAmount, 0);

  const totalRevenue = sum("paid");
  const pendingRevenue = sum("pending");
  const failedOrders = orders.filter((order) => order.paymentStatus === "failed").length;
  const totalPaidOut = payouts.reduce((total, payout) => total + payout.amount, 0);
  const availableBalance = totalRevenue - totalPaidOut;

  const dropRevenue = drops
    .map((drop) => ({
      id: drop.id,
      launchDate: drop.launchDate,
      status: drop.status,
      sales: drop.orders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((total, order) => total + order.totalAmount, 0),
      orderCount: drop.orders.filter((order) => order.paymentStatus === "paid").length,
    }))
    .filter((drop) => drop.orderCount > 0)
    .sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Finans</h1>
        <p className={styles.subtitle}>An overview of your revenue and payouts.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Available Balance</h3>
          <p className={styles.stat}>{availableBalance.toFixed(2)} DKK</p>
          <p className={styles.meta}>Paid revenue minus previous payouts</p>
          <PayoutButton availableBalance={availableBalance} hasBankAccount={!!artist?.bankAccountNumber} />
        </div>
        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <p className={styles.stat}>{totalRevenue.toFixed(2)} DKK</p>
          <p className={styles.meta}>From paid orders</p>
        </div>
        <div className={styles.card}>
          <h3>Pending Revenue</h3>
          <p className={styles.stat}>{pendingRevenue.toFixed(2)} DKK</p>
          <p className={styles.meta}>Awaiting payment confirmation</p>
        </div>
        <div className={styles.card}>
          <h3>Payout Account</h3>
          <p className={styles.stat}>{artist?.bankAccountNumber ? "Connected" : "Not set"}</p>
          <a href="/dashboard/personal-info" className={styles.link}>
            {artist?.bankAccountNumber ? "Update account" : "Add bank account"} &rarr;
          </a>
        </div>
      </div>

      {failedOrders > 0 && (
        <p className={styles.meta}>{failedOrders} failed order{failedOrders === 1 ? "" : "s"} not included above.</p>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Revenue by Drop</h2>
        {dropRevenue.length > 0 ? (
          <div className={styles.dropList}>
            {dropRevenue.map((drop) => (
              <div key={drop.id} className={styles.dropRow}>
                <div>
                  <p className={styles.dropDate}>{new Date(drop.launchDate).toLocaleString()}</p>
                  <p className={styles.meta}>
                    {drop.orderCount} paid order{drop.orderCount === 1 ? "" : "s"}
                  </p>
                </div>
                <p className={styles.dropSales}>{drop.sales.toFixed(2)} DKK</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.meta}>No revenue yet. Sales from your drops will show up here.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Payout History</h2>
        {payouts.length > 0 ? (
          <div className={styles.dropList}>
            {payouts.map((payout) => (
              <div key={payout.id} className={styles.dropRow}>
                <div>
                  <p className={styles.dropDate}>{new Date(payout.createdAt).toLocaleString()}</p>
                  <p className={styles.meta}>Sent to account ending {payout.bankAccountNumber.slice(-4)}</p>
                </div>
                <p className={styles.dropSales}>{payout.amount.toFixed(2)} DKK</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.meta}>No payouts yet.</p>
        )}
      </section>
    </div>
  );
}
