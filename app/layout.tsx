import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Signals · betterhomes",
  description:
    "UAE buyer-demand intelligence for betterhomes agents. Search volumes, price-sensitivity trends, area momentum, and buyer profile signals — sourced from Semrush.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
