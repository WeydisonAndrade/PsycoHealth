/**
 * Layout raiz da aplicação PsycoHealth.
 * Define fontes, metadados SEO, estrutura HTML global e envolve todas as páginas
 * com cabeçalho e rodapé compartilhados.
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Text } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/** Fonte serifada para títulos e elementos de destaque */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

/** Fonte serifada para corpo de texto e parágrafos */
const body = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

/** Metadados padrão exibidos em abas do navegador e resultados de busca */
export const metadata: Metadata = {
  title: "PsycoHealth | Telepsicologia",
  description:
    "Plataforma de telepsicologia — agende consultas, pague online e faça sessões por vídeo.",
};

/**
 * Componente de layout raiz — aplicado automaticamente a todas as rotas em `app/`.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Navegação global com links de autenticação e áreas do usuário */}
        <Header />
        {/* Conteúdo específico de cada rota renderizado aqui */}
        <main>{children}</main>
        {/* Rodapé com informações institucionais */}
        <Footer />
      </body>
    </html>
  );
}
