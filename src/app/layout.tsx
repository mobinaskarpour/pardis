import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "THE MACHINE — AI Command Center",
  description: "مرکز تصویربرداری پردیس نور — AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
