import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/const/api";
import { VEHICLE_IMAGES } from "@/const/vehicle-images";


const toDateInputValue = (value) => {
  if (!value) return "";
  // caso ISO string (lo más común), sirve slice(0,10)
  if (typeof value === "string") return value.slice(0, 10);
  // caso Date
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};


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
    mileage: "",
    itvDate: "",
    lastServiceDate: "",
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
          mileage: data.mileage ?? "",
          itvDate: toDateInputValue(data.itvDate),
          lastServiceDate: toDateInputValue(data.lastServiceDate),
        });
      } catch (error) {
        setMessage("Error al cargar el vehiculo para editar");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

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
          throw new Error("Solo los administradores pueden crear o editar Vehiculos");
        throw new Error(`Error HTTP: ${response.status}`);
      }

      navigate("/products");
    } catch (error) {
      setMessage(error.message || "Error al guardar el Vehiculo");
    }
  };

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-danger">{message}</div>}

      <h2 className="mb-4 text-center">{id ? "Editar vehículo" : "Crear vehículo"}</h2>

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
              placeholder="Ej: Lamborghini Huracán 2018"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
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

            <div className="col-md-6 mb-3">
              <label className="form-label">Stock (unidades)</label>
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
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Kilometraje (km)</label>
              <input
                type="number"
                className="form-control"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                min="0"
                placeholder="Ej: 32500"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Última ITV</label>
              <input
                type="date"
                className="form-control"
                name="itvDate"
                value={form.itvDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Último servicio</label>
            <input
              type="date"
              className="form-control"
              name="lastServiceDate"
              value={form.lastServiceDate}
              onChange={handleChange}
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
              placeholder="Ej: Gasolina · Automático · 610 CV · Negro"
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
