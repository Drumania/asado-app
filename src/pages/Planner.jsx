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
  const [horaComer, setHoraComer] = useState("21:00");

  const totalPersonas = PERSONA_EQUIVALENTE(adultos, ninos);
  const cortesPorCategoria = deflatCortesPorCategoria(cortesData);

  const calcularHoraInicio = (horaComer, minutosAntes) => {
    const [h, m] = horaComer.split(":").map(Number);
    const fecha = new Date();
    fecha.setHours(h);
    fecha.setMinutes(m - minutosAntes);
    return fecha.toTimeString().slice(0, 5); // HH:MM
  };

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
            else if (categoria === "coccion_rapida")
              offsetSalida = -15; // salen después
            else if (categoria === "coccion_lenta") offsetSalida = -30; // mucho después

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
                  : "Plato principal",
              tiempoCoccion: tiempo,
              horaInicio,
              horaSalida,
            };
          })
      )
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    return seleccionados.length ? seleccionadosCortes : [];
  };

  const extraerMinutos = (texto) => {
    let total = 0;

    const hsMatch = texto.match(/(\d+(?:\.\d+)?)\s*hs/gi);
    if (hsMatch) {
      total +=
        hsMatch.reduce(
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

  const generarTextoLista = () => {
    let mensaje = "🛒 Lista para el asado:\n\n";
    resultados.forEach((item) => {
      mensaje += `• ${item.nombre}: ${item.totalKg} kg\n`;
    });
    mensaje += `\n🔥 ¡Que no falte el fuego!`;
    return mensaje;
  };

  const calcularTiempoTotalAsado = () => {
    const seleccionadosCortes = cortesPorCategoria
      .flatMap(({ items }) => items)
      .filter((item) => seleccionados.includes(item.nombre));

    const tiempos = seleccionadosCortes.map((item) => {
      if (item.pasos) {
        return item.pasos.reduce((acc, paso) => acc + extraerMinutos(paso), 0);
      } else if (item.tiempo) {
        return extraerMinutos(item.tiempo);
      }
      return 0;
    });

    return Math.max(...tiempos, 0);
  };

  const obtenerHoraEncendidoFuego = () => {
    const linea = generarLineaDeTiempo();
    if (!linea.length) return null;
    return calcularHoraInicio(linea[0].horaInicio, 45);
  };

  return (
    <section className="container py-4">
      <h1 className="pb-4">Calculador de Asado</h1>

      <div className="row g-3 mb-5">
        <div className="col-6">
          <label className="form-label d-flex align-items-center gap-2">
            👤 Adultos
          </label>
          <div className="d-flex">
            <button
              className="cs-btn-rounded"
              type="button"
              onClick={() => setAdultos(Math.max(0, adultos - 1))}
            >
              −
            </button>
            <input
              type="number"
              className="cs-input-number"
              value={adultos}
              min={0}
              onChange={(e) => setAdultos(+e.target.value)}
            />
            <button
              className="cs-btn-rounded"
              type="button"
              onClick={() => setAdultos(adultos + 1)}
            >
              ＋
            </button>
          </div>
        </div>

        <div className="col-6">
          <label className="form-label d-flex align-items-center gap-2">
            <span style={{ transform: "scale(0.8)", display: "inline-block" }}>
              👤
            </span>{" "}
            Niños
          </label>
          <div className="d-flex">
            <button
              className="cs-btn-rounded"
              type="button"
              onClick={() => setNinos(Math.max(0, ninos - 1))}
            >
              −
            </button>
            <input
              type="number"
              className="cs-input-number"
              value={ninos}
              min={0}
              onChange={(e) => setNinos(+e.target.value)}
            />
            <button
              className="cs-btn-rounded"
              type="button"
              onClick={() => setNinos(ninos + 1)}
            >
              ＋
            </button>
          </div>
        </div>
      </div>

      {/* <h4 className="mb-3">Seleccioná los cortes</h4> */}

      {cortesPorCategoria.map(({ categoria, items }) => (
        <div key={categoria} className="mt-5 mb-4">
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
          <button
            className="btn btn-success ms-2 mb-3"
            onClick={() => {
              const texto = generarTextoLista();
              const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
              window.open(url, "_blank");
            }}
          >
            📲 Enviar por WhatsApp
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="form-label">🕒 ¿A qué hora querés comer?</label>
        <input
          type="time"
          className="form-control"
          value={horaComer}
          onChange={(e) => setHoraComer(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>🥩 Producto</th>
            <th>🔥 Entra a la parrilla</th>
            <th>🔥 Fuego</th>
            <th>🍽️ Sale de la parrilla</th>
            <th>🍽️ Plato</th>
          </tr>
        </thead>
        <tbody>
          {obtenerHoraEncendidoFuego() && (
            <tr className="table-warning  text-center">
              <td colSpan="5" className="py-4 fw-bold">
                Encender el fuego con leña y carbón a las{" "}
                <strong>{obtenerHoraEncendidoFuego()}</strong> para tener brasas
                listas.
              </td>
            </tr>
          )}
          {generarLineaDeTiempo().map((item, i) => (
            <tr key={i}>
              <td className="d-flex align-items-center gap-2">
                <img
                  src={`/img/${item.imagen}`}
                  alt={item.nombre}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                {item.nombre}
              </td>
              <td>{item.horaInicio}</td>
              <td className="text-capitalize">{item.fuego}</td>
              <td>{item.horaSalida}</td>
              <td>
                <span
                  className={`badge-plato ${
                    item.tipoPlato === "Entrada"
                      ? "badge-entrada"
                      : item.tipoPlato === "Primer plato"
                      ? "badge-primer"
                      : "badge-principal"
                  }`}
                >
                  {item.tipoPlato}
                </span>
              </td>
            </tr>
          ))}

          <tr className="table-warning  text-center">
            <td colSpan="5" className="py-4 fw-bold">
              Tiempo total estimado:
              <p>
                {calcularTiempoTotalAsado()} minutos (
                {(calcularTiempoTotalAsado() / 60).toFixed(1)} horas)
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

{
  /* <h1 className="text-center text-uppercase mb-4">Calculador de Asado</h1> */
}
