export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {year} PsycoHealth — Plataforma de telepsicologia</p>
      </div>
    </footer>
  );
}
