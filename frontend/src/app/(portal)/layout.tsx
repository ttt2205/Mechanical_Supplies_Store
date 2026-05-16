import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSH Group - Ống Thủy Lực & Phụ Kiện Công Nghiệp",
  description: "Chuyên cung cấp ống thủy lực, đầu bấm và phụ kiện chất lượng cao tại TP.HCM. Cam kết sản phẩm chính hãng, giá tốt nhất.",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
