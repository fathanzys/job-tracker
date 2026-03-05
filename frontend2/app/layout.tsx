import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track your job applications — stay organized, stay ahead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex min-h-screen bg-slate-50 text-slate-900`}>
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8 w-full max-w-[100vw]">
          {children}
        </main>
      </body>
    </html>
  );
}
