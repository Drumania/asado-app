export default function AsadoItem({ item }) {
  const tipoFuego = item.fuego.toLowerCase().replace(/[^a-z]/g, "");

  return (
    <div className="row align-items-center py-3 asado-item">
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
          <ul className="mb-0 ps-3">
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

      <div className="col-12 col-lg-3 text-center">
        <img
          src={`/src/assets/img/fuego-${tipoFuego}.png`}
          alt={item.fuego}
          style={{ maxHeight: "140px" }}
        />
      </div>
    </div>
  );
}
