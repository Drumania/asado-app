// src/pages/Cortes.jsx
import { useState } from "react";
import cortesData from "@/data/cortes.json";
import AsadoItem from "@/components/AsadoItem";

const CATEGORIES = [
  { key: "achuras", label: "Achuras" },
  { key: "coccion_rapida", label: "Cocción rápida" },
  { key: "coccion_lenta", label: "Cocción lenta" },
  { key: "verduras", label: "Verduras" },
];

export default function Cortes() {
  // Si la primera categoría no tiene data, busca la siguiente que sí
  const firstActive = CATEGORIES.find(
    (c) => (cortesData[c.key] ?? []).length > 0
  )?.key;
  const [active, setActive] = useState(firstActive);

  const renderItems = (items) =>
    items.map((item, i) => (
      <div key={i} className="col-12">
        <AsadoItem item={item} />
      </div>
    ));

  return (
    <section className="container py-4">
      <h1 className="title-fit text-center mb-4 text-uppercase">Cortes</h1>

      {/* Navegación de pestañas */}
      <ul className="custom-tabs">
        {CATEGORIES.map(({ key, label }) => {
          const hasContent = (cortesData[key] ?? []).length > 0;
          return (
            <li className="ct-nav-item" key={key}>
              <button
                className={
                  "nav-link d-flex align-items-center" +
                  (active === key ? " active" : "") +
                  (!hasContent ? " disabled" : "")
                }
                onClick={() => hasContent && setActive(key)}
                type="button"
              >
                {label}
                {!hasContent && (
                  <span className="badge bg-secondary ms-2">Próx.</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Contenido */}
      <div className="tab-content mt-4">
        {CATEGORIES.map(({ key }) => {
          const visible = active === key;
          return (
            <div
              key={key}
              className={`tab-pane fade${visible ? " show active" : ""}`}
            >
              <div className="row g-3">
                {visible && renderItems(cortesData[key] ?? [])}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
