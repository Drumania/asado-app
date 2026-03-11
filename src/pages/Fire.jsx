// src/pages/Fire.jsx
const fireTypes = [
  {
    id: "bajo",
    title: "Fuego Bajo",
    img: "/img/fuego-bajo.png",
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>11 segundos</strong>.
      </>
    ),
    detail: "Ideal para achuras delicadas como morcilla y mollejas. Cocción lenta y pareja que evita quemar el exterior.",
    color: "#4A9EFF",
  },
  {
    id: "medio",
    title: "Fuego Medio",
    img: "/img/fuego-medio.png",
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>9 segundos</strong>.
      </>
    ),
    detail: "Perfecto para bifes gruesos y mollejas. Permite dorar bien la superficie sin resecar el interior.",
    color: "#FFA030",
  },
  {
    id: "alto",
    title: "Fuego Alto",
    img: "/img/fuego-alto.png",
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>5 segundos</strong>.
      </>
    ),
    detail: "Para entraña, chinchulines y cortes finos. Sellado rápido que conserva los jugos internos.",
    color: "#FF5C1A",
  },
  {
    id: "indirecto",
    title: "Fuego Indirecto",
    img: "/img/fuego-indirecto.png",
    desc: "Se logra corriendo las brasas y dejando un hueco. El calor llega de costado.",
    detail: "Para costillar y vacío. Cocción muy lenta sin llamaradas directas, ideal para piezas grandes.",
    color: "#C8A97A",
  },
];

export default function Fire() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tipos de Fuego</h1>
        <p className="page-subtitle">Dominá el calor, dominá el asado</p>
      </div>

      {/* Tip card */}
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        marginBottom: "20px",
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>✋</span>
        <span>
          <strong style={{ color: "var(--text-primary)" }}>Truco del asador:</strong>{" "}
          Acercá la mano a 15 cm de la parrilla. El tiempo que podés aguantar determina la intensidad del fuego.
        </span>
      </div>

      <div className="card">
        {fireTypes.map((fuego) => (
          <div key={fuego.id} className="fire-row">
            <img
              src={fuego.img}
              alt={fuego.title}
              className="fire-row__img"
            />
            <div>
              <p
                className="fire-row__title"
                style={{ color: fuego.color }}
              >
                {fuego.title}
              </p>
              <p className="fire-row__desc">{fuego.desc}</p>
              <p
                className="fire-row__desc"
                style={{
                  marginTop: "6px",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                }}
              >
                {fuego.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
