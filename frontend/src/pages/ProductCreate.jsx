import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/const/api";
import { VEHICLE_IMAGES } from "@/const/vehicle-images";

const ProductCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "", 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/${id}`, { 
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setForm({
          name: data.name || "",
          price: data.price || "",
          stock: data.stock || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        setMessage("Error al cargar el producto para editar.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]); /*@por alguna razon se quito se lo vuelvo a poner*/

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`; 
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 403)
          throw new Error("Solo los administradores pueden crear o editar productos.");
        throw new Error(`Error HTTP: ${response.status}`);
      }

      navigate("/products");
    } catch (error) {
      setMessage(error.message || "Error al guardar el producto.");
    }
  };

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-danger">{message}</div>}

      <h2 className="mb-4 text-center">{id ? "Editar producto" : "Crear producto"}</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej: Ferrari Enzo 2021"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Precio (€)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ej: Gasolina · Manual · 500 CV · Amarillo"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <select
              className="form-select"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            >
              <option value="">Sin imagen</option>
              {VEHICLE_IMAGES.map((img) => (
                <option key={img.value} value={img.value}>
                  {img.label}
                </option>
              ))}
            </select>

            {form.imageUrl && (
              <div className="mt-3">
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Guardar
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductCreate;
