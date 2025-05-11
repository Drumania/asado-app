import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Planner from "./pages/Planner";
import NotFound from "./pages/NotFound";
import Cortes from "./pages/Cortes";
import Fire from "./pages/Fire";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Navbar />

      {/* Contenido de cada página */}
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/cortes" element={<Cortes />} />
          <Route path="/fuego" element={<Fire />} />

          {/* 404 catch‑all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
