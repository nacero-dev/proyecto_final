import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/const/api";

// Hooks personalizados
import { useError } from "@/hooks/useError";
import { useLoading } from "@/hooks/useLoading";
import { useMessage } from "@/hooks/useMessage";

// Función auxiliar para formatear fechas en la UI

// Función para formatear fechas en la tabla (explicacion en Productslist "replica")
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-ES");
};

// Vista de detalle de un vehículo "card" por ID

// Si el usuario es admin, permite editar y eliminar
const ProductDetail = () => {
  const { id } = useParams(); // id viene de la /products/:id
  const navigate = useNavigate();  // Hook de navegación para volver al inventario o ir a editar

  const [product, setProduct] = useState(null); // Estado del vehículo cargado desde el backend

  const loading = useLoading(true);
  const error = useError(null);
  const message = useMessage("");

  // Token y rol guardados en localStorage al iniciar sesión
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";


  // Al entrar a la vista, se consulta el detalle del vehículo por ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        error.clear();
        loading.set(true);

        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Manejo de errores HTTP para dar mensajes más claros
        if (!response.ok) {
          if (response.status === 404) throw new Error("Vehiculo no encontrado"); // en caso de respuesta 404 se muestra vehiculo no encontrado
          if (response.status === 401) throw new Error("No autorizado"); // en caso de respuesta no encontrar vehiculo por id
          throw new Error("Error al obtener el Vehiculo"); // en caso de no ser errores 404 / 401
        }

        // La respuesta llega en JSON y se convierte a objeto con response.json()
        const data = await response.json();

        // Se guarda el vehículo en el estado para poder renderizarlo
        setProduct(data);

      } catch (err) {
        error.set(err.message);
      } finally {
        loading.set(false);

      }
    };

    fetchProduct();
  }, [id, token]);



  //Elimina el vehículo actual
  const handleDelete = async () => {
    // setMessage(""); // Limpia mensajes previos
    message.clear(); // Limpia mensajes previos

    // si no es admin impide realizar el DELETE
    if (!isAdmin) {
      // setMessage("No tienes permisos para eliminar vehículos");
      message.set("No tienes permisos para eliminar vehículos");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si falla, se lanza error para entrar al catch
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);


      // Si elimina correctamente, se regresa al inventario
      navigate("/products");
    } catch (err) {

      message.set("No se pudo eliminar el vehículo.");
    }
  };

  // Mientras loading es true se renderiza spinner

  if (loading.value) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // caso Si se genera un error se muestra una alerta dependiendo del status error

  if (error.value) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error.value}</div>
      </div>
    );
  }

  // caso si no hay vehiculo cargados
  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">No se encontró el vehiculo</div>
      </div>
    );
  }

  // Si product.stock tiene un valor numerico usa ese valor, si el stock viene con null, vacio, o undefined usa 0 y lo convierte a numero para poder comparar (stock > 0)
  const stock = Number(product.stock || 0);

  return (

    <div className="container mt-4">

      {/* Mensajes informativos en cuanto a los vehiculos de la tabla */}
      {message.value && <div className="alert alert-info">{message.value}</div>}

      <h2 className="mb-4 text-center">Detalle del vehículo</h2>


      {/* Card centrada para presentar la información del vehículo */}
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>

        {/* Si hay imageUrl, se muestra como cabecera de la card */}
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

          {/* Se organiza la información en filas y columnas con Bootstrap */}

          <div className="row">
            <div className="col-md-6 mb-2">
              <strong>Precio:</strong> {Number(product.price || 0).toFixed(2)} €
            </div>

            <div className="col-md-6 mb-2">
              <strong>Stock:</strong> {stock}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Estado:</strong>{" "}

              {/* Estado calculado a partir del stock */}
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

            {/* Se utiliza formatDate como se configura arriva para ITV y Ulitmo servicio para la visualizacion en detalle */}

            <div className="col-md-6 mb-2">
              <strong>Última ITV:</strong> {formatDate(product.itvDate)}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Último servicio:</strong> {formatDate(product.lastServiceDate)}
            </div>
          </div>

          <hr />

          {/* Descripcion del vehículo */}
          <p className="card-text">
            <strong>Descripción:</strong> {product.description || "Sin descripción"}
          </p>

          {/* Botones de navegacion de acciones al final de la tabla */}
          <div className="d-grid gap-2 d-sm-flex mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/products")}
            >
              Volver al inventario
            </button>

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => navigate(`/contact?vehicle=${encodeURIComponent(product.name)}&id=${product._id}`)}
            >
              Contactar
            </button>

            {/* Acciones del administrador de edicion y eliminacion*/}
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


          {/* ID para referencia en MongoDB "mismo de la URL" */}

          <p className="text-muted mb-0 mt-3">
            <small>ID: {product._id}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
