export const MERCHBOOSTER_URL = process.env.NEXT_PUBLIC_MERCHBOOSTER_URL || "http://localhost:3000";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Help & Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping-info" },
      { label: "Returns & Refunds", href: "/returns" },
    ],
  },
  {
    title: "More about Backstage Drop",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Explorer",
    links: [
      { label: "Featured Artists", href: "/#featured" },
      { label: "Drops Closing Soon", href: "/#closing-soon" },
      { label: "Become an Artist", href: MERCHBOOSTER_URL },
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
      { label: "Payment Methods", href: "/payment-methods" },
      { label: "Delivery Options", href: "/delivery-options" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];
