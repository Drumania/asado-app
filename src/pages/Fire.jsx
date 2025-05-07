// src/pages/Fire.jsx
import React from "react";

const fireTypes = [
  {
    id: "bajo",
    title: "Fuego Bajo",
    img: "/img/fuego-bajo.png", // poné tus imágenes en /public/img/
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>11 segundos</strong>.
      </>
    ),
  },
  {
    id: "medio",
    title: "Fuego Medio",
    img: "/img/fuego-medio.png",
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>9 segundos</strong>.
      </>
    ),
  },
  {
    id: "alto",
    title: "Fuego Alto",
    img: "/img/fuego-alto.png",
    desc: (
      <>
        Podés sostener la mano sobre la parrilla a 15 cm durante{" "}
        <strong>5 segundos</strong>.
      </>
    ),
  },
  {
    id: "indirecto",
    title: "Fuego Indirecto",
    img: "/img/fuego-indirecto.png",
    desc: "Se logra corriendo las brasas y dejando un hueco. El calor llega de costado. Útil para cocción lenta sin quemar.",
  },
];

export default function Fire() {
  return (
    <section className="container py-4">
      <h1 className="text-center text-uppercase mb-4">Tipos de Fuego</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <tbody>
            {fireTypes.map((fuego) => (
              <tr key={fuego.id}>
                <td style={{ width: "160px" }}>
                  <img
                    src={fuego.img}
                    alt={fuego.title}
                    className="img-fluid rounded shadow-sm"
                  />
                </td>
                <td>
                  <h5 className="mb-1">{fuego.title}</h5>
                  <p className="mb-0 text-muted">{fuego.desc}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
