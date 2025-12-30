import "./App.css";

function App() {
  const contactLinks = [
    { label: "WhatsApp", href: "https://wa.me/5490000000000" },
    { label: "Sitio Web", href: "https://example.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ];

  return (
    <main className="screen">
      <section className="panel" aria-label="Inicio">
        <div className="logo-badge" style={{ "--delay": "80ms" }}>
          <span>Logo</span>
          <span>Empresa</span>
        </div>
        <div className="actions">
          <button
            className="pill primary"
            type="button"
            style={{ "--delay": "160ms" }}
          >
            Reservar Turno
          </button>
          {contactLinks.map((link, index) => (
            <a
              key={link.label}
              className="pill"
              href={link.href}
              style={{ "--delay": `${240 + index * 90}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
