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
  title: "BookHub - Sua Biblioteca Online",
  description: "Gerencie e reserve seus livros favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="text-gray-600 mb-2">
              © {new Date().getFullYear()} BookHub. Todos os direitos reservados.
            </div>
            <div className="text-sm text-gray-500">
              Sua biblioteca digital de confiança
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
