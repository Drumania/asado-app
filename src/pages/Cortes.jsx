// src/pages/Cortes.jsx
import { useState } from "react";
import cortesData from "@/data/cortes.json";
import AsadoItem from "@/components/AsadoItem";

const CATEGORIES = [
  { key: "achuras", label: "Achuras" },
  { key: "coccion_rapida", label: "Cocción Rápida" },
  { key: "coccion_lenta", label: "Cocción Lenta" },
  { key: "verduras", label: "Verduras" },
];

export default function Cortes() {
  const firstActive = CATEGORIES.find(
    (c) => (cortesData[c.key] ?? []).length > 0
  )?.key;
  const [active, setActive] = useState(firstActive);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cortes</h1>
        <p className="page-subtitle">Guía de preparación paso a paso</p>
      </div>

      {/* Pill tabs */}
      <div className="pill-tabs" role="tablist">
        {CATEGORIES.map(({ key, label }) => {
          const hasContent = (cortesData[key] ?? []).length > 0;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active === key}
              className={"pill-tab" + (active === key ? " active" : "")}
              disabled={!hasContent}
              onClick={() => hasContent && setActive(key)}
            >
              {label}
              {!hasContent && (
                <span className="pill-tab__badge">Próx.</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="card" style={{ overflow: "hidden" }}>
        {CATEGORIES.map(({ key }) =>
          active === key ? (
            <div key={key} role="tabpanel">
              {(cortesData[key] ?? []).map((item, i) => (
                <AsadoItem key={i} item={item} />
              ))}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
