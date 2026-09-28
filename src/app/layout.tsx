import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AskLpWidget from "@/components/ask-lp/AskLpWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lokanath Panda",
  description: "The Portfolio website of Lokanath Panda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative w-full flex items-center justify-center ">
          <Navbar />
        </div>
        {children}
        <AskLpWidget />
      </body>
    </html>
  );
}
