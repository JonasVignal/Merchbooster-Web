const BACKSTAGE_DROP_URL = process.env.NEXT_PUBLIC_BACKSTAGE_DROP_URL || "http://localhost:3001";

export type StorefrontFooterLink = { label: string; href: string };
export type StorefrontFooterColumn = { title: string; links: StorefrontFooterLink[] };

// Help/About/Payment pages live on Backstage Drop, not here, so those links point there.
export const STOREFRONT_FOOTER_COLUMNS: StorefrontFooterColumn[] = [
  {
    title: "Help & Support",
    links: [
      { label: "FAQ", href: `${BACKSTAGE_DROP_URL}/faq` },
      { label: "Contact Us", href: `${BACKSTAGE_DROP_URL}/contact` },
      { label: "Shipping Info", href: `${BACKSTAGE_DROP_URL}/shipping-info` },
      { label: "Returns & Refunds", href: `${BACKSTAGE_DROP_URL}/returns` },
    ],
  },
  {
    title: "More about Backstage Drop",
    links: [
      { label: "About Us", href: `${BACKSTAGE_DROP_URL}/about` },
      { label: "Careers", href: `${BACKSTAGE_DROP_URL}/careers` },
      { label: "Press", href: `${BACKSTAGE_DROP_URL}/press` },
      { label: "Blog", href: `${BACKSTAGE_DROP_URL}/blog` },
    ],
  },
  {
    title: "Explorer",
    links: [
      { label: "Featured Artists", href: `${BACKSTAGE_DROP_URL}/#featured` },
      { label: "Drops Closing Soon", href: `${BACKSTAGE_DROP_URL}/#closing-soon` },
      { label: "Become an Artist", href: "/register" },
    ],
  },
  {
    title: "Social media",
    links: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "X (Twitter)", href: "#" },
      { label: "Facebook", href: "#" },
    ],
  },
  {
    title: "Payment and delivery",
    links: [
      { label: "Payment Methods", href: `${BACKSTAGE_DROP_URL}/payment-methods` },
      { label: "Delivery Options", href: `${BACKSTAGE_DROP_URL}/delivery-options` },
      { label: "Track Your Order", href: `${BACKSTAGE_DROP_URL}/track-order` },
      { label: "Terms & Conditions", href: `${BACKSTAGE_DROP_URL}/terms` },
    ],
  },
];
