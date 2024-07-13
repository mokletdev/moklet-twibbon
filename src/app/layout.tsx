import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SonnerWrapper from "./_components/sonner-wrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Moklet Twibbon",
    template: "%s | Moklet Twibbon",
  },
  description:
    "Your twibbon platform, without any watermarks at all. Designed initially for the needs of simple, and fast twibbon campaign platform.",
  creator: "MokletDev Team",
  keywords: "twibbon, SMK, Moklet, Malang",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SonnerWrapper />
        {children}
      </body>
    </html>
  );
}
