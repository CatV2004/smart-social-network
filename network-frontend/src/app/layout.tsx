
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/custom.css";
import "@/lib/fontawesome";
import { Inter, playwrite } from "@/lib/fonts";

import { ThemeProvider } from "@/app/_providers/ThemeProvider";
import { ReduxProvider } from "@/app/_providers/ReduxProvider";

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
    <html
      lang="vi"
      className={`${Inter.variable} ${playwrite.variable}`}
      
    >
      <body className="font-sans">
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
