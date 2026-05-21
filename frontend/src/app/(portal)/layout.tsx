import type { Metadata } from "next";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import FloatingSidebar from "@/components/ui/FloatingSidebar";
import SessionInitializer from "@/components/ui/SessionInitializer";

export const metadata: Metadata = {
  title: "CÔNG TY TNHH MÁY VÀ THIẾT BỊ HƯNG THỊNH - CUNG CẤP ỐNG THỦY LỰC, PHỤ KIỆN CÔNG NGHIỆP, MÁY VÀ THIẾT BỊ",
  description: "Chuyên cung cấp ống thủy lực, đầu bấm và phụ kiện chất lượng cao tại TP.HCM. Cam kết sản phẩm chính hãng, giá tốt nhất.",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <SessionInitializer />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingSidebar />
    </>
  );
}
