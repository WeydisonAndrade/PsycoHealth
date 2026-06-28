/**
 * Cabeçalho fixo do site com logo e navegação principal.
 * Usado em src/app/layout.tsx (presente em todas as páginas); carrega a sessão no servidor.
 */
import Link from "next/link";
import { getSession } from "@/lib/session";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  /* --- Estado e hooks (servidor) --- */
  const session = await getSession();

  /* --- Renderização --- */
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          PsycoHealth
        </Link>
        <HeaderNav session={session} />
      </div>
    </header>
  );
}
