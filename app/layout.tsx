import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام القرعة الذكي | Smart Lottery System",
  description: "نظام قرعة عصري وجذاب لاختيار الأرقام العشوائية مع إمكانية التصدير",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
