import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";

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
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
