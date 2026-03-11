// src/pages/Planner.jsx
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import cortesData from "@/data/cortes.json";

const PERSONA_EQUIVALENTE = (adultos, ninos) => adultos + ninos * 0.5;

function deflatCortesPorCategoria(cortesRaw) {
  return Object.entries(cortesRaw).map(([categoria, items]) => ({
    categoria,
    items,
  }));
}

const CATEGORY_LABELS = {
  achuras: "Achuras",
  coccion_rapida: "Cocción Rápida",
  coccion_lenta: "Cocción Lenta",
  verduras: "Verduras",
};

export default function Planner() {
  const location = useLocation();
  const asadoCargado = location.state?.asado ?? null;

  const [adultos, setAdultos] = useState(asadoCargado?.personas?.adultos ?? 5);
  const [ninos, setNinos] = useState(asadoCargado?.personas?.ninos ?? 0);
  const [seleccionados, setSeleccionados] = useState(
    asadoCargado?.cortes?.map((c) => c.nombre) ?? []
  );
  const [horaComer, setHoraComer] = useState(asadoCargado?.horaComer ?? "21:00");
  const [bannerVisible, setBannerVisible] = useState(!!asadoCargado);

  const totalPersonas = PERSONA_EQUIVALENTE(adultos, ninos);
  const cortesPorCategoria = deflatCortesPorCategoria(cortesData);

  // ── helpers ─────────────────────────────────────────────
  const calcularHoraInicio = (horaComer, minutosAntes) => {
    const [h, m] = horaComer.split(":").map(Number);
    const fecha = new Date();
    fecha.setHours(h);
    fecha.setMinutes(m - minutosAntes);
    return fecha.toTimeString().slice(0, 5);
  };

  const extraerMinutos = (texto) => {
    let total = 0;
    const hsMatch = texto.match(/(\d+(?:\.\d+)?)\s*hs/gi);
    if (hsMatch) {
      total += hsMatch.reduce(
        (sum, str) => sum + parseFloat(str.replace(",", ".").match(/[\d.]+/)),
        0
      ) * 60;
    }
    const minMatch = texto.match(/(\d+)\s*min/gi);
    if (minMatch) {
      total += minMatch.reduce((sum, str) => sum + parseInt(str), 0);
    }
    return total;
  };

  const toggleCorte = (nombre) => {
    setSeleccionados((prev) =>
      prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
    );
  };

  // ── computed ─────────────────────────────────────────────
  const resultados = cortesPorCategoria
    .flatMap(({ items }) => items)
    .filter((c) => seleccionados.includes(c.nombre))
    .map((c) => {
      const porcion = c.porcion || 300;
      const totalGr = totalPersonas * porcion;
      return { ...c, totalGr, totalKg: (totalGr / 1000).toFixed(2) };
    });

  const generarLineaDeTiempo = () => {
    const seleccionadosCortes = cortesPorCategoria
      .flatMap(({ categoria, items }) =>
        items
          .filter((item) => seleccionados.includes(item.nombre))
          .map((item) => {
            const tiempo = item.pasos
              ? item.pasos.reduce((acc, paso) => acc + extraerMinutos(paso), 0)
              : item.tiempo
                ? extraerMinutos(item.tiempo)
                : 0;

            let offsetSalida = 0;
            if (categoria === "achuras") offsetSalida = 0;
            else if (categoria === "coccion_rapida") offsetSalida = -15;
            else if (categoria === "coccion_lenta") offsetSalida = -30;

            const momentoMinutos = tiempo + offsetSalida;
            const horaInicio = calcularHoraInicio(horaComer, momentoMinutos);
            const horaSalida = calcularHoraInicio(horaComer, offsetSalida);

            return {
              nombre: item.nombre,
              fuego: item.fuego,
              imagen: item.imagen,
              categoria,
              tipoPlato:
                categoria === "achuras"
                  ? "Entrada"
                  : categoria === "coccion_rapida"
                    ? "Primer plato"
                    : "Principal",
              tiempoCoccion: tiempo,
              horaInicio,
              horaSalida,
            };
          })
      )
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    return seleccionados.length ? seleccionadosCortes : [];
  };

  const calcularTiempoTotalAsado = () => {
    const tiempos = cortesPorCategoria
      .flatMap(({ items }) => items)
      .filter((item) => seleccionados.includes(item.nombre))
      .map((item) => {
        if (item.pasos) return item.pasos.reduce((acc, paso) => acc + extraerMinutos(paso), 0);
        else if (item.tiempo) return extraerMinutos(item.tiempo);
        return 0;
      });
    return Math.max(...tiempos, 0);
  };

  const obtenerHoraEncendidoFuego = () => {
    const linea = generarLineaDeTiempo();
    if (!linea.length) return null;
    return calcularHoraInicio(linea[0].horaInicio, 45);
  };

  const generarTextoLista = () => {
    let msg = "Lista para el asado:\n\n";
    resultados.forEach((item) => { msg += `• ${item.nombre}: ${item.totalKg} kg\n`; });
    msg += `\n¡Que no falte el fuego!`;
    return msg;
  };

  const guardarAsado = () => {
    const nombre = prompt("Ingresá un nombre para este asado:");
    if (nombre) {
      const nuevoAsado = {
        nombre,
        fecha: new Date().toISOString(),
        cortes: resultados,
        horaComer,
        personas: { adultos, ninos },
      };
      const guardados = JSON.parse(localStorage.getItem("asados") || "[]");
      guardados.push(nuevoAsado);
      localStorage.setItem("asados", JSON.stringify(guardados));
      alert("¡Asado guardado con éxito! 🔥");
    }
  };

  const lineaDeTiempo = generarLineaDeTiempo();
  const horaFuego = obtenerHoraEncendidoFuego();
  const tiempoTotal = calcularTiempoTotalAsado();

  // ── render ─────────────────────────────────────────────
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Calculador</h1>
        <p className="page-subtitle">Planificá tu asado sin errores</p>
      </div>

      {/* Loaded asado banner */}
      {bannerVisible && asadoCargado && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          background: "rgba(255,92,26,0.12)",
          border: "1px solid rgba(255,92,26,0.35)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "0.88rem",
          color: "var(--text-primary)",
        }}>
          <span>📂 Asado cargado: <strong>{asadoCargado.nombre}</strong></span>
          <button
            style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1 }}
            onClick={() => setBannerVisible(false)}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {/* Config card */}
      <div className="planner-config">
        <p className="section-label" style={{ marginBottom: "16px" }}>Configuración</p>

        <div className="planner-config__row">
          <span className="planner-config__label">👤 Adultos</span>
          <div className="stepper">
            <button className="stepper__btn" onClick={() => setAdultos(Math.max(0, adultos - 1))}>−</button>
            <input
              type="number"
              className="stepper__val"
              value={adultos}
              min={0}
              onChange={(e) => setAdultos(+e.target.value)}
            />
            <button className="stepper__btn" onClick={() => setAdultos(adultos + 1)}>＋</button>
          </div>
        </div>

        <div className="planner-config__row">
          <span className="planner-config__label">🧒 Niños</span>
          <div className="stepper">
            <button className="stepper__btn" onClick={() => setNinos(Math.max(0, ninos - 1))}>−</button>
            <input
              type="number"
              className="stepper__val"
              value={ninos}
              min={0}
              onChange={(e) => setNinos(+e.target.value)}
            />
            <button className="stepper__btn" onClick={() => setNinos(ninos + 1)}>＋</button>
          </div>
        </div>

        <div className="planner-config__row">
          <span className="planner-config__label">🕒 ¿A qué hora comemos?</span>
          <input
            type="time"
            className="time-field"
            style={{ width: "auto", minWidth: "120px" }}
            value={horaComer}
            onChange={(e) => setHoraComer(e.target.value)}
          />
        </div>
      </div>

      {/* Cuts selector */}
      <p className="section-label">Seleccioná los cortes</p>

      <div className="card" style={{ marginBottom: "24px", overflow: "hidden" }}>
        {cortesPorCategoria.map(({ categoria, items }) =>
          items.length > 0 ? (
            <div key={categoria}>
              <p className="category-header">{CATEGORY_LABELS[categoria] ?? categoria}</p>
              {items.map((corte) => {
                const sel = seleccionados.includes(corte.nombre);
                return (
                  <div
                    key={corte.nombre}
                    className={`corte-row${sel ? " selected" : ""}`}
                    onClick={() => toggleCorte(corte.nombre)}
                  >
                    {/* Custom check */}
                    <div className="corte-row__check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <img
                      src={`/img/${corte.imagen}`}
                      alt={corte.nombre}
                      className="corte-row__img"
                    />

                    <div className="corte-row__info">
                      <p className="corte-row__name">{corte.nombre}</p>
                      <p className="corte-row__time">⏱ {corte.tiempo}</p>
                    </div>

                    <img
                      src={`/img/fuego-${corte.fuego.toLowerCase()}.png`}
                      alt={corte.fuego}
                      title={corte.fuego}
                      className="corte-row__fire"
                    />
                  </div>
                );
              })}
            </div>
          ) : null
        )}
      </div>

      {/* Results */}
      {resultados.length > 0 && (
        <div className="result-section">
          <div className="result-header">
            <h3>Tu lista de compras</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {totalPersonas} pers.
            </span>
          </div>

          {resultados.map((r) => (
            <div key={r.nombre} className="result-row">
              <span className="result-row__name">{r.nombre}</span>
              <span className="result-row__kg">{r.totalKg} kg</span>
            </div>
          ))}

          <div style={{ padding: "16px 20px" }}>
            <div className="action-row">
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  const texto = generarTextoLista();
                  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
                  window.open(url, "_blank");
                }}
              >
                WhatsApp
              </button>
              <button className="btn btn--ember btn--sm" onClick={guardarAsado}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {lineaDeTiempo.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <p className="section-label">Línea de tiempo</p>

          {horaFuego && (
            <div className="fire-banner">
              <span className="fire-banner__icon">🔥</span>
              <span>
                Encendé el fuego con leña y carbón a las{" "}
                <strong>{horaFuego}</strong> para tener brasas listas.
              </span>
            </div>
          )}

          <div className="card" style={{ marginTop: "12px", overflowX: "auto" }}>
            <table className="timeline-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Entra</th>
                  <th>Fuego</th>
                  <th>Sale</th>
                  <th>Plato</th>
                </tr>
              </thead>
              <tbody>
                {lineaDeTiempo.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="timeline-table__product">
                        <img
                          src={`/img/${item.imagen}`}
                          alt={item.nombre}
                          className="timeline-table__img"
                        />
                        {item.nombre}
                      </div>
                    </td>
                    <td className="timeline-table__time">{item.horaInicio}</td>
                    <td>
                      <Link
                        to="/fuego"
                        style={{ color: "var(--ember)", fontWeight: 600, fontSize: "0.85rem", textTransform: "capitalize", textDecoration: "underline", textDecorationColor: "var(--ember-glow)" }}
                      >
                        {item.fuego}
                      </Link>
                    </td>
                    <td className="timeline-table__time">{item.horaSalida}</td>
                    <td>
                      <span className={`badge-plato ${item.tipoPlato === "Entrada"
                        ? "badge-entrada"
                        : item.tipoPlato === "Primer plato"
                          ? "badge-primer"
                          : "badge-principal"
                        }`}>
                        {item.tipoPlato}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tiempoTotal > 0 && (
            <div className="total-banner" style={{ marginTop: "10px" }}>
              Tiempo total estimado:{" "}
              <strong>
                {tiempoTotal} min ({(tiempoTotal / 60).toFixed(1)} hs)
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
