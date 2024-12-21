import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import UserProfile from "@/components/user/UserProfile";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-stalk",
  description: "Cutting through the noise, highlighting the signal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen">
            {/* Unified header for both mobile and desktop */}
            <div className="w-full py-2 px-4">
              <UserProfile />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative">{children}</div>
          </div>
        </Providers>
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
