import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
// Importar la configuración de Font Awesome
import "@/lib/fontawesome";
import Panel from "@/components/Panel";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alan Madrigal — Software Engineer Student",
    template: "%s | Alan Madrigal",
  },
  description:
    "Portfolio and CV of Alan Madrigal, software engineering student: about me, education, projects, skills and contacts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} bg-background text-foreground antialiased`}
      >
        <Providers>
          <Panel />
          {children}
        </Providers>
      </body>
    </html>
  );
}
