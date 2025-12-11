import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ProductCreate = () => {
  const { id } = useParams(); // si existe, estamos editando
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      // Aquí más adelante cargaremos el producto desde la API para editarlo.
      console.log("Editar producto con id:", id);
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí más adelante haremos fetch (POST/PUT) a la API.
    console.log("Formulario enviado:", form);
  };

  return (
    <div>
      <h2>{id ? "Editar producto" : "Crear producto"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Precio</label>
          <br />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <br />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <br />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
