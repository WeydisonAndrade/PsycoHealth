/**
 * Rodapé do site com copyright e nome da plataforma.
 * Usado em src/app/layout.tsx (presente em todas as páginas).
 */
export function Footer() {
  const year = new Date().getFullYear();

  /* --- Renderização --- */
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {year} PsycoHealth — Plataforma de telepsicologia</p>
      </div>
    </footer>
  );
}
