import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <h1>Gestor de Productos</h1>
      {/* aquí tu render */}
    </div>
  );
}

export default App;
