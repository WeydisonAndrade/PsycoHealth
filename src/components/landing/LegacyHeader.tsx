"use client";

import Link from "next/link";
import { useState } from "react";

/** Header idêntico ao legacy/index.html — menu âncora + links do MVP */
export function LegacyHeader() {
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

  function handleAnchorClick() {
    closeMenu();
  }

  return (
    <header role="banner">
      <div className="container">
        <Link href="/" className="logo" aria-label="PsicoHealth — Página inicial">
          PsicoHealth
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="main-nav"
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
        <nav id="main-nav" role="navigation" aria-label="Menu principal" className={open ? "is-open" : ""}>
          <ul className="nav-list">
            <li>
              <a href="#sobre" onClick={handleAnchorClick}>
                Sobre
              </a>
            </li>
            <li>
              <a href="#areas" onClick={handleAnchorClick}>
                Áreas
              </a>
            </li>
            <li>
              <a href="#como-funciona" onClick={handleAnchorClick}>
                Como Funciona
              </a>
            </li>
            <li>
              <a href="#beneficios" onClick={handleAnchorClick}>
                Benefícios
              </a>
            </li>
            <li>
              <a href="#contato" onClick={handleAnchorClick}>
                Contato
              </a>
            </li>
            <li>
              <a href="#agendar" className="btn btn-primary" onClick={handleAnchorClick}>
                Agendar Consulta
              </a>
            </li>
            <li className="nav-auth">
              <Link href="/login" onClick={closeMenu}>
                Entrar
              </Link>
              <Link href="/psychologists" className="btn btn-secondary" onClick={closeMenu}>
                Psicólogos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
