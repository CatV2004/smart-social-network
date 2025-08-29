// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/custom.css";
import "@/lib/fontawesome";
import { Inter, playwrite } from "@/lib/fonts";
import { AppProviders } from "./_providers/AppProviders";
import { GlobalSocketListener } from "@/components/common/GlobalSocketListener";

export const metadata: Metadata = {
  title: "NeuroNet",
  description: "Một sản phẩn được thiết kế bởi CuongDev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${Inter.variable} ${playwrite.variable}`}>
      <body className="font-sans">
        <AppProviders>
          <GlobalSocketListener />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
