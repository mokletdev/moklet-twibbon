import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SonnerWrapper from "./_components/sonner-wrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Moklet Twibbon - Create Custom Twibbons Without Watermarks",
    template: "%s | Moklet Twibbon",
  },
  description:
    "Create and share custom twibbons without watermarks. A fast, simple twibbon campaign platform designed for SMK Telkom Malang (Moklet) community and beyond.",
  creator: "MokletDev Team",
  keywords: [
    "twibbon",
    "twibbon maker",
    "twibbon generator",
    "SMK Telkom Malang",
    "Moklet",
    "Malang",
    "photo frame",
    "profile picture",
    "free twibbon",
    "no watermark",
    "custom twibbon",
    "campaign twibbon",
  ],
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "MokletDev Team" }],
  alternates: {
    canonical: "https://twibbon.moklet.org/",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B73636",
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
