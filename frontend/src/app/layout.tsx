import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";

const sans = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Bogura Kothon",
  description: "Multilingual newsroom platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} font-sans`}>{children}</body>
    </html>
  );
}
