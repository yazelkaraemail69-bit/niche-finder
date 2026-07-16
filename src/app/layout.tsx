import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niş Ürün Bulucu - Yüksek Kârlı Niş Fırsatları",
  description: "E-ticaret için düşük rekabetli, yüksek kâr marjlı niş ürünleri keşfedin. Akıllı algoritma ile en kârlı fırsatları bulun.",
  keywords: "niş ürün, e-ticaret, kârlı ürün, dropshipping, trend ürünler, düşük rekabet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}