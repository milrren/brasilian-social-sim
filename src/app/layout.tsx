import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Brasims - Simulador de Vida Brasileira',
  description: 'Viva a experiência única de um simulador de vida no Brasil. Trabalhe, evolua e conquiste seus objetivos!',
  openGraph: {
    title: 'Brasims - Brazilian Life Simulator',
    description: 'O jogo de simulação social mais autêntico do Brasil.',
    url: 'https://brasilian-social-sim.vercel.app/',
    siteName: 'Brasims',
    images: [
      {
        url: 'https://brasilian-social-sim.vercel.app/og-image.png', // Caminho da sua imagem na pasta public
        width: 1200,
        height: 630,
        alt: 'Preview do jogo Brasims',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brasims',
    description: 'Simulador de vida brasileira feito em Next.js',
    images: ['https://brasilian-social-sim.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics/>
      <SpeedInsights/>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
