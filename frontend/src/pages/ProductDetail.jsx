import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/const/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-ES");
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Vehiculo no encontrado");
          if (response.status === 401) throw new Error("No autorizado");
          throw new Error("Error al obtener el Vehiculo");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleDelete = async () => {
    setMessage("");

    if (!isAdmin) {
      setMessage("No tienes permisos para eliminar vehículos");
      return;
    }


    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      navigate("/products");
    } catch (err) {
      setMessage("No se pudo eliminar el vehículo.");
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">No se encontró el vehiculo</div>
      </div>
    );
  }

  const stock = Number(product.stock || 0);

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-info">{message}</div>}

      <h2 className="mb-4 text-center">Detalle del vehículo</h2>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="card-img-top"
            style={{ maxHeight: "320px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <h5 className="card-title mb-3">{product.name}</h5>

          <div className="row">
            <div className="col-md-6 mb-2">
              <strong>Precio:</strong> {Number(product.price || 0).toFixed(2)} €
            </div>

            <div className="col-md-6 mb-2">
              <strong>Stock:</strong> {stock}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Estado:</strong>{" "}
              {stock > 0 ? (
                <span className="badge bg-success ms-2">Disponible</span>
              ) : (
                <span className="badge bg-danger ms-2">No disponible</span>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Kilometraje:</strong>{" "}
              {Number(product.mileage || 0).toLocaleString("es-ES")} km
            </div>

            <div className="col-md-6 mb-2">
              <strong>Última ITV:</strong> {formatDate(product.itvDate)}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Último servicio:</strong> {formatDate(product.lastServiceDate)}
            </div>
          </div>

          <hr />

          <p className="card-text">
            <strong>Descripción:</strong> {product.description || "Sin descripción"}
          </p>

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/products")}
            >
              Volver al inventario
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/products/create/${product._id}`)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>

          <p className="text-muted mb-0 mt-3">
            <small>ID: {product._id}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
