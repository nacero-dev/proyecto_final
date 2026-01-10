import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Producto no encontrado.");
          if (response.status === 401) throw new Error("No autorizado.");
          throw new Error("Error al obtener el producto.");
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
  }, [id]);

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
        <div className="alert alert-warning">No se encontró el producto.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Detalle del producto</h2>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">
            <strong>Precio:</strong> {product.price} €
          </p>
          <p className="card-text">
            <strong>Stock:</strong> {product.stock}
          </p>
          <p className="card-text">
            <strong>Descripción:</strong>{" "}
            {product.description || "Sin descripción"}
          </p>
          <p className="text-muted">
            <small>ID: {product._id}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
