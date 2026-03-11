import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [asados, setAsados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("asados") || "[]");
    setAsados(guardados);
  }, []);

  const CTA_CARDS = [
    {
      title: "Calculador",
      desc: "Porción exacta por persona y línea de tiempo",
      to: "/planner",
    },
    {
      title: "Cortes",
      desc: "Guía de preparación para cada corte",
      to: "/cortes",
    },
    {
      title: "Fuego",
      desc: "Tipos de fuego y cuándo usar cada uno",
      to: "/fuego",
    },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="home-hero">
        <span className="home-hero__emoji">🔥</span>
        <h1 className="home-hero__title">
          El asado<br /><span>perfecto</span> te espera
        </h1>
        <p className="home-hero__sub">
          Tu guía para el asado argentino clásico
        </p>
      </div>

      {/* Quick actions */}
      <p className="section-label">¿Qué querés hacer?</p>
      <div className="home-cta-grid">
        {CTA_CARDS.map((card) => (
          <button
            key={card.to}
            className="home-cta-card"
            onClick={() => navigate(card.to)}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
              <span className="home-cta-card__title" style={{ fontSize: "1.05rem" }}>{card.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ember)", flexShrink: 0 }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className="home-cta-card__desc">{card.desc}</span>
          </button>
        ))}
      </div>

      {/* Saved asados */}
      <div className="section-divider" />
      <p className="section-label">Mis asados guardados</p>

      {asados.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">📋</span>
          <p className="empty-state__text">
            Aún no guardaste ningún asado.<br />
            ¡Usá el Calculador para planificar uno!
          </p>
        </div>
      ) : (
        <div>
          {asados.map((asado, i) => (
            <button
              key={i}
              className="saved-card"
              style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "var(--surface-1)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "10px", transition: "border-color var(--dur) var(--ease), transform var(--dur) var(--ease)" }}
              onClick={() => navigate("/planner", { state: { asado } })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ember)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="saved-card__name">{asado.nombre}</p>
                <span style={{ fontSize: "0.78rem", color: "var(--ember)", fontWeight: 600 }}>Ver →</span>
              </div>
              <p className="saved-card__meta">
                📅 {new Date(asado.fecha).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                &nbsp;·&nbsp;
                👤 {asado.personas?.adultos} adultos
                {asado.personas?.ninos > 0 && `, ${asado.personas.ninos} niños`}
              </p>
              {asado.cortes?.length > 0 && (
                <div className="saved-card__cuts">
                  {asado.cortes.map((c, j) => (
                    <span key={j} className="saved-card__tag">
                      {c.nombre} {c.totalKg}kg
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
