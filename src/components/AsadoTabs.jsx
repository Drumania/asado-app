import { useState, useEffect } from "react";
import cortesData from "../data/cortes.json";
import AsadoItem from "./AsadoItem";

export default function AsadoTabs() {
  const [activeTab, setActiveTab] = useState("achuras");

  const renderItems = (items) => {
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
      </ul>

      <div>{renderItems(cortesData[activeTab], activeTab)}</div>
    </div>
  );
}
