/**
 * Navegação do cabeçalho com links condicionais conforme autenticação e papel do usuário.
 * Menu colapsável em mobile; botão Sair sempre visível quando autenticado.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { SessionPayload } from "@/lib/session";
import { getDashboardPath } from "@/lib/auth-routes";

interface HeaderNavProps {
  session: SessionPayload | null;
}

export function HeaderNav({ session }: HeaderNavProps) {
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

  return (
    <div className="header-toolbar">
      {session && (
        <LogoutButton variant="secondary" size="sm" className="nav-logout-direct" />
      )}

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
                <Link href={getDashboardPath(session.role)} onClick={closeMenu}>
                  Minha área
                </Link>
              </li>
              <li className="nav-logout-menu">
                <LogoutButton variant="ghost" size="sm" fullWidth className="nav-logout-menu-btn" />
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
    </div>
  );
}
