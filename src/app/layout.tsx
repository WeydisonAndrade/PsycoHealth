/**
 * Layout raiz — apenas fontes e estilos globais.
 * Header/Footer ficam nos route groups (landing) e (platform).
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Text } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PsycoHealth | Psicologia — Sabedoria e Equilíbrio",
  description:
    "PsicoHealth - Psicologia e saúde mental. Atendimento humanizado inspirado no cuidado clássico com a mente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className={body.className}>{children}</body>
    </html>
  );
}
