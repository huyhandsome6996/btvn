import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const pixelMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Dungeon RPG - Hầm Ngục Pixel",
  description: "Game RPG pixel 2D dò hầm ngục - Chiến đấu với quái vật, thu thập vật phẩm, khám phá hầm ngục!",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${pixelMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
