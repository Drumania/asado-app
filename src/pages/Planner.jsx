// src/pages/Planner.jsx
import { useState } from "react";
import cortesData from "@/data/cortes.json";

const PERSONA_EQUIVALENTE = (adultos, ninos) => adultos + ninos * 0.5;

function deflatCortesPorCategoria(cortesRaw) {
  return Object.entries(cortesRaw).map(([categoria, items]) => ({
    categoria,
    items,
  }));
}

export default function Planner() {
  const [adultos, setAdultos] = useState(5);
  const [ninos, setNinos] = useState(0);
  const [seleccionados, setSeleccionados] = useState([]);

  const totalPersonas = PERSONA_EQUIVALENTE(adultos, ninos);
  const cortesPorCategoria = deflatCortesPorCategoria(cortesData);

  const toggleCorte = (nombre) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre]
    );
  };

  const resultados = cortesPorCategoria
    .flatMap(({ items }) => items)
    .filter((c) => seleccionados.includes(c.nombre))
    .map((c) => {
      const porcion = c.porcion || 300; // default si falta
      const totalGr = totalPersonas * porcion;
      return {
        ...c,
        totalGr,
        totalKg: (totalGr / 1000).toFixed(2),
      };
    });

  return (
    <section className="container py-4">
      <h1
        className="text-center text-uppercase mb-4"
        style={{
          fontSize: "clamp(2rem, 10vw, 12vw)",
          whiteSpace: "nowrap",
          lineHeight: 1.1,
          width: "100%",
          margin: "0 auto",
        }}
      >
        Calculador de Asado
      </h1>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label d-flex align-items-center gap-2">
            👤 Adultos
          </label>
          <div className="input-group">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setAdultos(Math.max(0, adultos - 1))}
            >
              −
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={adultos}
              min={0}
              onChange={(e) => setAdultos(+e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setAdultos(adultos + 1)}
            >
              ＋
            </button>
          </div>
        </div>

        <div className="col-6">
          <label className="form-label d-flex align-items-center gap-2">
            🧒 Niños
          </label>
          <div className="input-group">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setNinos(Math.max(0, ninos - 1))}
            >
              −
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={ninos}
              min={0}
              onChange={(e) => setNinos(+e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setNinos(ninos + 1)}
            >
              ＋
            </button>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Seleccioná los cortes</h4>

      {cortesPorCategoria.map(({ categoria, items }) => (
        <div key={categoria} className="mb-4">
          <h5 className="text-capitalize mb-3">
            {categoria.replace("_", " ")}
          </h5>
          <div className="list-group-flush">
            {items.map((corte) => (
              <div
                key={corte.nombre}
                className={`d-flex align-items-center gap-3 py-3 cs-border-bottom-dashed ${
                  seleccionados.includes(corte.nombre) ? "selected-item" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => toggleCorte(corte.nombre)}
              >
                <div className="custom-checkbox ps-2">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(corte.nombre)}
                    onChange={() => toggleCorte(corte.nombre)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <img
                  src={`/img/${corte.imagen}`}
                  alt={corte.nombre}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div className="flex-grow-1">
                  <strong>{corte.nombre}</strong>
                  <div className="text-muted small">⏱️ {corte.tiempo}</div>
                </div>

                <div className="block pe-2">
                  <img
                    src={`/img/fuego-${corte.fuego.toLowerCase()}.png`}
                    alt={corte.fuego}
                    title={corte.fuego}
                    style={{ height: 60, objectFit: "contain" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {resultados.length > 0 && (
        <div className="mt-5">
          <h4>Resultado</h4>
          <ul className="list-group">
            {resultados.map((r) => (
              <li key={r.nombre} className="list-group-item">
                <strong>{r.nombre}:</strong> {r.totalKg} kg
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

{
  /* <h1 className="text-center text-uppercase mb-4">Calculador de Asado</h1> */
}
