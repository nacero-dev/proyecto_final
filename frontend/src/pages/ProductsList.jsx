import { useEffect, useState } from "react";
import { API_URL } from "@/const/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-ES");
};

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

      setProducts(products.filter((product) => product._id !== id));
      setMessage("Producto eliminado correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
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
    <div className="container-fluid mt-4 px-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <h2 className="mb-4 text-center">Lista de productos</h2>

      {isAdmin && (
        <div className="text-end mb-3">
          <a href="/products/create" className="btn btn-primary">
            Añadir vehículo
          </a>
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-warning text-center">No hay vehículos disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th style={{ width: "110px" }}>Imagen</th>
                <th>Vehículo</th>
                <th style={{ width: "130px" }}>Precio</th>
                <th style={{ width: "140px" }}>Stock</th>
                <th style={{ width: "140px" }}>Estado</th>
                <th style={{ width: "140px" }}>ITV</th>
                <th style={{ width: "160px" }}>Servicio</th>
                <th style={{ width: "140px" }}>Km</th>
                <th>Descripción</th>
                <th className="text-end" style={{ width: "220px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: 90,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </td>

                  <td>
                    <strong>{product.name}</strong>
                  </td>

                  <td>{Number(product.price || 0).toFixed(2)} €</td>

                  <td>{Number(product.stock || 0)}</td>

                  <td>
                    {Number(product.stock || 0) > 0 ? (
                      <span className="badge bg-success">Disponible</span>
                    ) : (
                      <span className="badge bg-danger">No disponible</span>
                    )}
                  </td>

                  <td>{formatDate(product.itvDate)}</td>

                  <td>{formatDate(product.lastServiceDate)}</td>

                  <td>{Number(product.mileage || 0).toLocaleString("es-ES")} km</td>

                  <td style={{ maxWidth: 360 }}>
                    <span className="text-muted">{product.description || "-"}</span>
                  </td>

                  <td className="text-end">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
