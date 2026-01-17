import { useEffect, useState } from "react";
import { API_URL } from "@/const/api";

// Hooks personalizados
import { useError } from "@/hooks/useError";
import { useLoading } from "@/hooks/useLoading";
import { useMessage } from "@/hooks/useMessage";

// Función para formatear fechas en la tabla que sirve para leer una fecha por un usuario

const formatDate = (value) => {
  if (!value) return "-"; // si no hay fecha o hay algun dato invalido retorna "-"
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-"; // si no hay fecha o hay algun dato invalido retorna "-"
  return date.toLocaleDateString("es-ES"); // si es valido retorna fecha en formato dd/mm/aaaa "-"
};


// Página principal después de iniciar sesión
//Muestra el inventario de vehículos y permite acciones según el rol
const ProductsList = () => {

  // Estados reutilizables
  const error = useError(null);
  const loading = useLoading(true);
  const message = useMessage("");

  const [products, setProducts] = useState([]);  // Estado con la lista de vehículos recibida del backend
  const token = localStorage.getItem("token");  // Token JWT guardado en localStorage al hacer login (se usa para Authorization)
  const isAdmin = localStorage.getItem("isAdmin") === "true"; //Rol guardado en localStorage como string ("true"/"false"), se convierte a dato boolean

  //Estado del texto de búsqueda
  const [search, setSearch] = useState("");

  // Estado para saber si actualmente se muestran resultados filtrados
  const [isFiltering, setIsFiltering] = useState(false);


  // Helper para mostrar mensajes temporales (evita repetir setTimeout en muchos lugares)
  const showMessage = (text, ms = 3000) => {
    message.set(text);
    setTimeout(() => message.clear(), ms);
  };


  // Función que consulta el inventario al backend
  // está protegido y requiere token Bearer válido
  const fetchProducts = async () => {
    try {

      error.clear();
      loading.set(true);

      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Authorization JWT para acceder a rutas protegidas

      // Manejo de errores HTTP
      if (!response.ok) {
        if (response.status === 401) throw new Error("No autorizado: inicia sesión");
        throw new Error(`Error HTTP: ${response.status}`);
      }
      /// response.ok, es boolean que trae fetch, vale true cuando todo se ejecuta sin problema false cuando hay un error 
      // 401 cuando algo falla con el token, (ej. cuando caduca el tpoken) 
      // el segundo throw es si hay otro tipo de error no 401


      // La respuesta llega como JSON y se convierte a objeto con response.json()
      const data = await response.json();
      setProducts(data); // Se guarda la lista en el estado para renderizar la tabla

      // Si se cargando el listado completo, se deja de estar en modo “filtrado” por lo tanto  setIsFiltering(false)

      setIsFiltering(false);
    } catch (err) {
      error.set(err.message || "No se pudieron cargar los Vehículos");
    } finally {
      loading.set(false);
    }
  };

  // Consulta al backend usando el endpoint con operadores de MongoDB (GET /products/filter?q=fer)
  // En el backend, "q" se usa con $regex + $options:"i" para coincidencias parciales sin distinguir mayúsculas/minúsculas
  const fetchProductsByName = async (query) => {
    try {
      error.clear();
      message.clear();
      loading.set(true);

      // encodeURIComponent convierte el texto del usuario a un formato seguro para URL espacios, acentos, símbolos, por ejemplo "rolls royce" -> "rolls%20royce"
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

      const q = encodeURIComponent(query);

      const response = await fetch(`${API_URL}/products/filter?q=${q}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("No autorizado: inicia sesión");
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data); // reemplaza la tabla por los resultados filtrados
      setIsFiltering(true); // estado filtrando


    } catch (err) {
      error.set(err.message || "No se pudieron cargar los Vehículos");
    } finally {
      loading.set(false);
    }
  };

  // useEffect ejecuta fetchProducts una sola vez al cargar la pagina, se renderiza el inventario inicial despues del login
  useEffect(() => {
    fetchProducts();
  }, []);



  // submit del buscador
  // si el input está vacío: vuelve a cargar inventario completo
  // si hay texto: filtra por nombre con /products/filter?q=...
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const q = search.trim();

    // Si no hay texto, se interpreta como “volver al listado completo”
    if (!q) {
      fetchProducts();
      return;
    }

    fetchProductsByName(q);
  };

  //limpiar buscador y volver al inventario completo
  const handleClearSearch = () => {
    setSearch("");
    fetchProducts();
  };


  // Elimina un vehículo por ID

  const handleDelete = async (id) => {
    try {
      error.clear();
      message.clear();

      if (!isAdmin) {
        showMessage("No tienes permisos para eliminar Vehículos"); // Solo admin tiene la facultadde eliminar ademas el backend vuelve a validar permisos
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }); // ruta protegida por JWT, y restringida solo a admin

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      // Si se aplica DELETE correctamente, se actualiza el estado local
      setProducts(products.filter((product) => product._id !== id)); // se saca del inventario el vehículo borrado 
      showMessage("Vehículo eliminado correctamente");
    } catch (err) {
      error.set("No se pudo eliminar el Vehículo");
    }
  };

  if (loading.value) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    ); // mostrar spinner en lo que loading esta ejecutando
  }

  //DETALLE DE INVENTARIO DE VEHICULOS EN TABLA

  return (
    <div className="container-fluid mt-4 px-4">

      {/* Alertas de estado */}
      {error.value && <div className="alert alert-danger">{error.value}</div>}
      {message.value && <div className="alert alert-info">{message.value}</div>}

      <h2 className="mb-4 fw-bold fs-1 text-center">SuperAutos</h2> 
      <h2 className="mb-4 text-center">Inventario de Vehiculos</h2>

      {/* Barra de búsqueda por nombre usa query param q, en backend aplica $regex + $options:"i" */}
      <form onSubmit={handleSearchSubmit} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder='Buscar por nombre'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn btn-outline-primary" type="submit">
            Buscar
          </button>

          {/* Botón para volver al inventario completo */}
          {(isFiltering || search.trim()) && (
            <button className="btn btn-outline-secondary" type="button" onClick={handleClearSearch}>
              Limpiar
            </button>
          )}
        </div>


      </form>


      {/* Botón de alta de vehiculo solo visible para admin */}
      {isAdmin && (
        <div className="text-end mb-3">
          <a href="/products/create" className="btn btn-primary">
            Añadir vehículo
          </a>
        </div>
      )}

      {/* Si no hay datos, se muestra mensaje "no hay vehculos disponibles", else muestro los detalles tipo tabla de cada columna */}
      {products.length === 0 ? (
        <div className="alert alert-warning text-center">No hay vehículos disponibles</div>
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
              {/* Renderizado de fila con map e id, cada product es un vehículo */}
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

                  {/* Estructura de Datos de la tabla de inventario */}

                  {/* Nombre */}
                  <td>
                    <strong>{product.name}</strong>
                  </td>

                  {/* Precio formateado a 2 decimales */}
                  <td>{Number(product.price || 0).toFixed(2)} €</td>

                  {/* Vehiculos en inventario del mismo modelo */}
                  <td>{Number(product.stock || 0)}</td>

                  {/* Estado calculado desde inventario se hace un badge de Bootstrap https://getbootstrap.com/docs/5.3/components/badge/*/}
                  <td>
                    {Number(product.stock || 0) > 0 ? (
                      <span className="badge bg-success">Disponible</span>
                    ) : (
                      <span className="badge bg-danger">No disponible</span>
                    )}
                  </td>

                  {/* Fecha ITV con formato especifico */}
                  <td>{formatDate(product.itvDate)}</td>

                  {/* Fecha ultimo servicio de mantenimiento con formato espcifoco */}
                  <td>{formatDate(product.lastServiceDate)}</td>

                  {/* Descripción con límite visual */}
                  <td>{Number(product.mileage || 0).toLocaleString("es-ES")} km</td>

                  {/* Descripcion del vehiculo */}
                  <td style={{ maxWidth: 360 }}>
                    <span className="text-muted">{product.description || "-"}</span>
                  </td>

                  <td className="text-end" style={{ width: "220px" }}>


                    {/* Botones para usuarios visores */}

                    <div className="d-inline-flex flex-wrap gap-2 justify-content-end">
                      <a
                        href={`/products/${product._id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Ver
                      </a>

                      <a
                        href={`/contact?vehicle=${encodeURIComponent(product.name)}&id=${product._id}`}
                        className="btn btn-sm btn-outline-success"
                      >
                        Contactar
                      </a>

                      {/* Botones para usuarios administrador */}

                      {isAdmin && (
                        <>
                          <a
                            href={`/products/create/${product._id}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Editar
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
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
