import { useState } from "react";
import fireTypes from "@/data/fuegos.json";

export default function AsadoItem({ item }) {
  const tipoFuego = item.fuego.toLowerCase().replace(/[^a-z]/g, "");
  const fuegoData = fireTypes.find((f) => f.id === tipoFuego);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="row align-items-center py-3 asado-item position-relative">
      <div className="col-12 col-lg-3 text-center">
        <img
          src={`/img/${item.imagen}`}
          alt={item.nombre}
          className="asado-img"
        />
      </div>

      <div className="col-12 col-lg-6 text-center text-lg-start">
        <h2 className="mb-3">{item.nombre.toUpperCase()}</h2>

        {item.tiempo && (
          <p className="badge-time mb-3">
            <strong>⏱️</strong> {item.tiempo}
          </p>
        )}

        {item.tips && (
          <p className="mb-0">
            <strong>💡</strong> {item.tips}
          </p>
        )}

        {item.pasos && (
          <ul
            className="mb-0 mt-3 pt-3 ps-3"
            style={{ borderTop: "1px solid black" }}
          >
            {item.pasos.map((paso, i) => (
              <li key={i}>
                <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                  {i + 1}.
                </span>
                {paso}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-12 col-lg-3 text-center position-relative">
        <div
          className="tooltip-wrapper"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)} // para mobile
          style={{ display: "inline-block", position: "relative" }}
        >
          <img
            src={`/img/fuego-${tipoFuego}.png`}
            alt={item.fuego}
            style={{ maxHeight: "140px", cursor: "pointer" }}
          />

          {showTooltip && fuegoData && (
            <div className="custom-tooltip">
              <strong>{fuegoData.title}</strong>
              <div dangerouslySetInnerHTML={{ __html: fuegoData.desc }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
