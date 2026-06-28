/**
 * Navegação do cabeçalho com links condicionais conforme autenticação e papel do usuário.
 * Menu colapsável em mobile (mobile first).
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { SessionPayload } from "@/lib/session";

interface HeaderNavProps {
  session: SessionPayload | null;
}

export function HeaderNav({ session }: HeaderNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    setOpen((prev) => {
      document.body.style.overflow = prev ? "" : "hidden";
      return !prev;
    });
  }

  async function handleLogout() {
    closeMenu();
    await fetch("/api/auth/session", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="platform-nav"
        onClick={toggleMenu}
      >
        <span className="icon-menu" aria-hidden="true">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </span>
        <span className="icon-close" aria-hidden="true">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </span>
      </button>

      <nav
        id="platform-nav"
        className={`nav-actions${open ? " is-open" : ""}`}
        aria-label="Menu principal"
      >
        <ul className="nav-list">
          <li>
            <Link href="/psychologists" onClick={closeMenu}>
              Psicólogos
            </Link>
          </li>
          {session ? (
            <>
              <li>
                <Link
                  href={
                    session.role === "PSYCHOLOGIST"
                      ? "/dashboard/psychologist"
                      : "/dashboard/patient"
                  }
                  onClick={closeMenu}
                >
                  Minha área
                </Link>
              </li>
              <li>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" onClick={closeMenu}>
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/register/patient" onClick={closeMenu}>
                  <Button size="sm" className="nav-cta-btn">
                    Cadastrar
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
