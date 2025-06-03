import type { Metadata } from "next";
// Removing default Geist fonts for simplicity, can be added back if desired
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Adjust path if necessary

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "BookHub - Your Online Library", // Updated title
  description: "Manage and reserve your favorite books.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}> */}
      <body className="antialiased bg-gray-50 text-gray-900"> {/* Simplified body classes */}
        <Navbar />
        <main className="container mx-auto p-4 mt-4">
          {children}
        </main>
        <footer className="text-center p-4 mt-8 text-sm text-gray-600 border-t">
          © {new Date().getFullYear()} BookHub. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
