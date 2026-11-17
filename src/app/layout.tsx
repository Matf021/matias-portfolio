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
  title:
    "Matias Franco | Software Developer & Creative Technologist",

  description:
    "Explore the portfolio of Matias Franco, a Toronto-based software developer building intelligent systems, cloud applications, and immersive 3D experiences.",

  applicationName: "Matias Franco Portfolio",

  authors: [{ name: "Matias Franco" }],

  creator: "Matias Franco",

  keywords: [
    "Matias Franco",
    "Software Developer",
    "Software Engineer",
    "Creative Technology",
    "Artificial Intelligence",
    "Machine Learning",
    "Three.js",
    "React",
    "Next.js",
    "Python",
    "Cloud Engineering",
    "Toronto",
  ],

  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Matias Franco",
    title:
      "Matias Franco | Software Developer & Creative Technologist",
    description:
      "Intelligent systems, creative engineering, and immersive digital experiences. Explore my projects through an interactive 3D constellation.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Matias Franco | Software Developer & Creative Technologist",
    description:
      "Explore intelligent systems, creative engineering, and an interactive 3D constellation.",
  },

  robots: {
    index: true,
    follow: true,
  },
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