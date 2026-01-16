import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/const/api";
import { VEHICLE_IMAGES } from "@/const/vehicle-images";


// Hooks personalizados
import { useLoading } from "@/hooks/useLoading";
import { useMessage } from "@/hooks/useMessage";

// Función para formatear fechas de inputs al crear vehiculos en los apartados itv y ultima fecha de servicio 

const toDateInputValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}; 

// Un input date necesita un string "YYYY-MM-DD" (sin hora)
// Si viene con hora, se necesita hacer un value.slice(0, 10) para que quede en el formato correcto.
// slice(0,10) deja solo "YYYY-MM-DD", que es lo que necesita el input date.
// si viene en formato valido "Date" entonces si viene como Date u otro valor convertible a Date
// si la fecha es invalida entonces ""
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date


// Creacion o edicion de un vehículo, se utiliza el mismo formato de formulario para editar o crear un vehiculo desde cero

const ProductCreate = () => {
  const { id } = useParams(); 

  // Hook para redirigir al inventario cuando se guarda correctamente
  const navigate = useNavigate();

  // Token para acceder a rutas protegidas
  const token = localStorage.getItem("token");

  // Estados  del formulario, cada input usa este estado como "value"
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

  // loading se usa para mostrar spinner mientras se carga el vehículo en modo edición

  const loading = useLoading(false);

  // message se usa para mostrar errores o avisos en pantalla

   const message = useMessage(""); 

  // Si existe id, significa que estamos editando:


  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Si no hay id, estamos creando; no hay informacion de vehiculos para cargar

      try {

        message.clear();
        loading.set(true);

        // setLoading(true);
        const response = await fetch(`${API_URL}/products/${id}`, { 
          headers: { Authorization: `Bearer ${token}` },
        });   // se hace un GET para traer datos en el formulario

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();

        // Se llena el formulario con los datos del backend
        // "||" pone valor por defecto si viene vacío
        // "??" mantiene 0 como válido (si viniera 0, no lo reemplaza)

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
        message.set("Error al cargar el vehículo para editar");

      } finally {
        loading.set(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja cambios en cualquier input del formulario
  // Usa el atributo name del input para actualizar el campo correcto
  const handleSubmit = async (e) => {
    e.preventDefault();
    message.clear();


    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`; // Decide ruta y método según si hay id o no

    const method = id ? "PUT" : "POST"; //Si hay "id" en la URL, es edición (carga datos y hace PUT), Si no hay "id", es creación (form vacío y hace POST)

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
        if (response.status === 403) {
          throw new Error("Solo los administradores pueden crear o editar Vehiculos"); //control de edicion y creacion limitado a administradores
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Si todo salió bien, se vuelve al inventario
      navigate("/products");
    } catch (error) {
      message.set(err.message || "Error al guardar el vehículo");
    }
  };

  // Formulario de creacion y edicion de vehiculos

  return (
    <div className="container mt-4">

      {/* Mensaje de error/aviso */}
      {message.value && <div className="alert alert-danger">{message.value}</div>}

      <h2 className="mb-4 text-center">{id ? "Editar vehículo" : "Crear vehículo"}</h2>

      {/* Si loading, se muestra spinner mientras se cargan los datos del vehículo */}
      {loading.value ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="mb-3">

            {/* Fila de Nombre */}
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="Ej: Lamborghini Huracán 2018"/>
          </div>

          {/* Fila de precio y stock */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio (€)</label>
              <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required min="0"/>
            </div>


            {/* Fila de Unidades */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Stock (unidades)</label>
              <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} required min="0"/>
            </div>
          </div>

          {/* Fila de Kilometraje e ITV */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Kilometraje (km)</label>
              <input type="number" className="form-control" name="mileage" value={form.mileage} onChange={handleChange} min="0" placeholder="Ej: 32500"/>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Última ITV</label>
              <input type="date" className="form-control" name="itvDate" value={form.itvDate} onChange={handleChange}/>
            </div>
          </div>

          {/* Fila de Último servicio */}
          <div className="mb-3">
            <label className="form-label">Último servicio</label>
            <input type="date" className="form-control" name="lastServiceDate" value={form.lastServiceDate} onChange={handleChange}/>
          </div>

          {/* Fila de Descripcion */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Ej: Gasolina · Automático · 610 CV · Negro"/>
          </div>

          {/* Selector de imagen predefinida */}
          <div className="mb-3">
            <label className="form-label">Imagen</label>
            
            <select className="form-select" name="imageUrl" value={form.imageUrl} onChange={handleChange}>
              
              <option value="">Sin imagen</option>

              {VEHICLE_IMAGES.map((img) => (
                <option key={img.value} value={img.value}>
                  {img.label}
                </option>
              ))}

            </select>

            {/* 
              name="imageUrl" indica a handleChange el campo del estado que debe actualizar, como handleChange hace setForm({ ...form, [e.target.name]: e.target.value }); actualiza form.imageUrl
              Esto hace que el <select> sea controlado por React: el valor mostrado depende del estado
              Si se carga un vehículo y imageUrl ya viene con "/vehicles/ferrari.webp", el select queda seleccionado automáticamente en esa opción https://react.dev/reference/react-dom/components/select?utm_source=chatgpt.com
              onChange={handleChange} si se selecciona otra opción, se dispara el evento y se actualiza form.imageUrl con el value del <option> https://www.youtube.com/watch?v=u-m0XINQUyY
              Si el usuario elige sin imagen, imageUrl queda en "" no se guarda ruta y se muestra sin imagen <img>
              En VEHICLE_IMAGES se generan las opciones a elegir desde un array 
              value={img.value}: es lo que se guarda en form.imageUrl
              {img.label}: es lo que el usuario ve en el dropdown (el nombre de los vehiculos)
              En mongo se envia el body por medio de JSON.stringify(form), imageUrl viaja como texto
              mongo guarda el string que contiene name e imageUrl y el navegador lo carga desde public/vehicles (estan alojadas en Github)
            */}


            {/* Posteriormente de elegir el nombre del vehiculo del dropdown se da Vista previa de la imagen elegida */}

            {form.imageUrl && (
              <div className="mt-3">
                <img src={form.imageUrl} alt="Vista previa"
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

          {/* Botón submit: crea o guarda cambios */}

          <button type="submit" className="btn btn-primary w-100">
            Guardar
          </button>


        </form>
      )}
    </div>
  );
};

export default ProductCreate;
