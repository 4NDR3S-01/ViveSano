import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import AppClientLayout from "./AppClientLayout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViveSano",
  description: "Aplicacion web de Habitos Saludables gamificado",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors fade-in`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppClientLayout>
            {children}
          </AppClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
