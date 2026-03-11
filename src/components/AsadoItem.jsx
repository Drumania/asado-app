import { useState } from "react";
import fireTypes from "@/data/fuegos.json";

export default function AsadoItem({ item }) {
  const [open, setOpen] = useState(false);
  const tipoFuego = item.fuego.toLowerCase().replace(/[^a-z]/g, "");
  const fuegoData = fireTypes.find((f) => f.id === tipoFuego);

  return (
    <div className={`corte-detail${open ? " open" : ""}`}>
      {/* Header row (clickable) */}
      <div className="corte-detail__header" onClick={() => setOpen(!open)}>
        <img
          src={`/img/${item.imagen}`}
          alt={item.nombre}
          className="corte-detail__img"
        />

        <div className="corte-detail__meta">
          <p className="corte-detail__name">{item.nombre.toUpperCase()}</p>
          {item.tiempo && (
            <span className="corte-detail__time">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {item.tiempo}
            </span>
          )}
        </div>

        <div className="tooltip-wrap">
          <img
            src={`/img/fuego-${tipoFuego}.png`}
            alt={item.fuego}
            className="corte-detail__fire"
          />
        </div>

        <div className="corte-detail__expand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expandable body */}
      <div className="corte-detail__body">
        <div className="corte-detail__inner">
          {fuegoData && (
            <div style={{ marginBottom: "12px" }}>
              <p className="section-label" style={{ marginBottom: "4px" }}>
                Tipo de fuego: {fuegoData.title}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}
                dangerouslySetInnerHTML={{ __html: fuegoData.desc }}
              />
            </div>
          )}

          {item.tips && (
            <div className="corte-detail__tip">
              💡 {item.tips}
            </div>
          )}

          {item.pasos && (
            <div className="corte-detail__steps">
              {item.pasos.map((paso, i) => (
                <div key={i} className="corte-detail__step">
                  <span className="corte-detail__step-num">{i + 1}</span>
                  <span>{paso}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
