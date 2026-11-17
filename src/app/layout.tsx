import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matias Franco | Software Developer",
  description:
    "Portfolio of Matias Franco, a software developer exploring artificial intelligence, cloud engineering, and creative technology.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#introduction"
          className="
        sr-only
        focus:not-sr-only
        focus:fixed focus:left-4 focus:top-4 focus:z-[100]
        focus:rounded-lg focus:bg-accent
        focus:px-4 focus:py-3
        focus:text-sm focus:font-semibold focus:text-background
    "
        >
          Skip to portfolio content
        </a>
        {children}
      </body>
    </html>
  );
}