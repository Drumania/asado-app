import { useState, useEffect } from 'react';

export default function Home() {
  const [asados, setAsados] = useState([]);

  useEffect(() => {
    // Cargar asados guardados del localStorage
    const asadosGuardados = JSON.parse(localStorage.getItem('asados') || '[]');
    setAsados(asadosGuardados);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido a Asado App!</h1>
        <p className="text-xl">Tu compañero perfecto para preparar los mejores asados</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Mis Asados</h2>
        {asados.length === 0 ? (
          <div className="text-center p-6 bg-gray-100 rounded-lg">
            <p>Aún no tienes asados guardados. ¡Comienza a planificar uno nuevo!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {asados.map((asado, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold">{asado.nombre}</h3>
                <p className="text-gray-600">Fecha: {new Date(asado.fecha).toLocaleDateString()}</p>
                <div className="mt-2">
                  <p className="font-medium">Cortes seleccionados:</p>
                  <ul className="list-disc list-inside">
                    {asado.cortes.map((corte, i) => (
                      <li key={i}>{corte.nombre} - {corte.peso}kg</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
