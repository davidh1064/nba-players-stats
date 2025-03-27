import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NBA Stats",
  description:
    "Your home for every NBA player's stats from 1996 to 2022 season",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-full bg-gradient-to-b from-gray-50 to-white`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4">
              <Navigation />
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
