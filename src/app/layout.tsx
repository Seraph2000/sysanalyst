import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import ConditionalLayout from "@/components/ConditionalLayout";
import CookieBanner from "@/components/CookieBanner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SysAnalyst — Systems Analyst Agent",
  description: "A specialised analysis agent that brings clarity to messy MVPs and early-stage ideas.",
  metadataBase: new URL("https://sysanalyst.dev"),
  openGraph: {
    title: "SysAnalyst — Systems Analyst Agent",
    description: "Structural clarity for messy MVPs and early-stage ideas.",
    url: "https://sysanalyst.dev",
    siteName: "SysAnalyst",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SysAnalyst — Systems Analyst Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SysAnalyst — Systems Analyst Agent",
    description: "Structural clarity for messy MVPs and early-stage ideas.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <AuthGuard>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthGuard>
          <CookieBanner />
        </AuthProvider>
        <Script
          defer
          data-domain="sysanalyst.dev"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
