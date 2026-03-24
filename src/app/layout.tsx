import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "Travel Roulette",
  description:
    "Throw a dart at the world map and discover your next destination",
  openGraph: {
    title: "Travel Roulette",
    description:
      "Throw a dart at the world map and discover your next destination",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Roulette",
    description:
      "Throw a dart at the world map and discover your next destination",
  },
  other: {
    "theme-color": "#0a0f0a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} h-full antialiased`}>
      <body className="bg-bg-dark text-gray-200 font-mono min-h-screen flex flex-col">
        {/* Decorative neon top bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon/40 to-transparent z-50 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
