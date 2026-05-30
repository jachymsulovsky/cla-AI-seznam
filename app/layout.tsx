import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "../components/convex-client-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "CLA AI whitelist",
  description: "Správa povolených AI nástrojů pro firmu.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
