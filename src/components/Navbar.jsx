import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container cs-border-bottom py-4">
        <NavLink className="navbar-brand fw-bold" to="/">
          Asado Argentino
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto gap-lg-5">
            {/* <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Inicio
              </NavLink>
            </li> */}

            <li className="nav-item">
              <NavLink
                to="/planner"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Calculador
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/cortes"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Como preparar
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/fuego"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Fuego
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
