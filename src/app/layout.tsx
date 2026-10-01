import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AskLpWidget from "@/components/ask-lp/AskLpWidget";
import SmoothScroll from "@/components/layout/SmoothScroll";
import site from "@/data/content/site.json";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const script = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.brand.title,
  description: site.brand.description,
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${mono.variable} ${script.variable} font-sans antialiased bg-[#030712]`}
      >
        <SmoothScroll />
        <div aria-hidden className="site-grid pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <AskLpWidget />
      </body>
    </html>
  );
}
