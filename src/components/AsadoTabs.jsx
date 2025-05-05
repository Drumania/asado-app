import { useState, useEffect } from "react";
import cortesData from "../data/cortes.json";
import AsadoItem from "./AsadoItem";

export default function AsadoTabs() {
  const [activeTab, setActiveTab] = useState("achuras");

  const isTabDisabled = (tab) => {
    const items = cortesData[tab];
    return !items || items.length === 0 || items[0].proximamente;
  };

  const renderItems = (items, tab) => {
    if (!items || items.length === 0) return null;

    return items.map((item, i) => <AsadoItem key={i} item={item} />);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-uppercase">Asado app</h1>

      <ul className="custom-tabs">
        <li className="ct-nav-item">
          <button
            className={`nav-link ${activeTab === "achuras" ? "active" : ""}`}
            onClick={() => setActiveTab("achuras")}
          >
            Achuras
          </button>
        </li>
        <li className="ct-nav-item">
          <button
            className={`nav-link ${
              activeTab === "coccion_rapida" ? "active" : ""
            }`}
            onClick={() => setActiveTab("coccion_rapida")}
          >
            Cocción Rápida
          </button>
        </li>
        <li className="ct-nav-item">
          <button
            className={`nav-link ${
              activeTab === "coccion_lenta" ? "active" : ""
            }`}
            onClick={() => setActiveTab("coccion_lenta")}
          >
            Cocción Lenta
          </button>
        </li>
        <li className="ct-nav-item text-muted">
          <button
            className={`nav-link position-relative ${
              activeTab === "verduras" ? "active" : ""
            }`}
            onClick={() =>
              !isTabDisabled("verduras") && setActiveTab("verduras")
            }
            disabled={isTabDisabled("verduras")}
          >
            Verduras
            {isTabDisabled("verduras") && (
              <span
                className="badge bg-danger prox"
                style={{ fontSize: "0.6rem" }}
              >
                Próx.
              </span>
            )}
          </button>
        </li>
      </ul>

      <div>{renderItems(cortesData[activeTab], activeTab)}</div>
    </div>
  );
}
