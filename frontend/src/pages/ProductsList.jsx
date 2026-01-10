import { useEffect, useState } from "react";
import { API_URL } from "@/const/api"; /*@*/


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("No autorizado: inicia sesión.");
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (!isAdmin) {
        setMessage("No tienes permisos para eliminar productos.");
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      setProducts(products.filter((p) => p._id !== id)); /*@ p.*/
      setMessage("Producto eliminado correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <h2 className="mb-4 text-center">Lista de productos</h2>

      {isAdmin && (
        <div className="text-end mb-3">
          <a href="/products/create" className="btn btn-primary">
            Crear producto
          </a>
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-warning text-center">No hay productos disponibles.</div>
      ) : (
        <ul className="list-group">
          {products.map((product) => (
            <li
              key={product._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{product.name}</strong> — {product.price} € (Stock: {product.stock})
              </div>
              <div>
                <a
                  href={`/products/${product._id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Ver
                </a>
                {isAdmin && (
                  <>
                    <a
                      href={`/products/create/${product._id}`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
