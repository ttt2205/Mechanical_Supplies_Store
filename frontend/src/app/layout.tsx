import type { Metadata } from "next";
import { Inter, Montserrat, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "./index.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CÔNG TY TNHH MÁY VÀ THIẾT BỊ HƯNG THỊNH - CUNG CẤP ỐNG THỦY LỰC, PHỤ KIỆN CÔNG NGHIỆP, MÁY VÀ THIẾT BỊ",
  description: "Chuyên cung cấp ống thủy lực, đầu bấm và phụ kiện chất lượng cao tại TP.HCM. Cam kết sản phẩm chính hãng, giá tốt nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${montserrat.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
