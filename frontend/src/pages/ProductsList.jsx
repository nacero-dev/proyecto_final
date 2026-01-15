import { useEffect, useState } from "react";
import { API_URL } from "@/const/api";


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
  const [products, setProducts] = useState([]);  // Estado con la lista de vehículos recibida del backend
  const [error, setError] = useState(null);   /// Estado de error para mostrar alertas si falla una petición
  const [loading, setLoading] = useState(true);  // Estado que informa la carga mostrando spinner mientras se consulta el inventario
  const [message, setMessage] = useState(""); // Mensajes informativos en pantalla para experiencia de usuario
  const token = localStorage.getItem("token");  // Token JWT guardado en localStorage al hacer login (se usa para Authorization)
  const isAdmin = localStorage.getItem("isAdmin") === "true"; //Rol guardado en localStorage como string ("true"/"false"), se convierte a dato boolean


  // Función que consulta el inventario al backend
  // está protegido y requiere token Bearer válido
  const fetchProducts = async () => {
    try {
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
    } catch (err) {
      setError(err.message || "No se pudieron cargar los Vehículos"); // sale un error ya especificado en controllers o definido si no esta especificado si ocurre un error 
    } finally {
      setLoading(false); //desactiviación de loading que estaba true inicialmente al obtener un estado resultante
    }
  };

  // useEffect ejecuta fetchProducts una sola vez al cargar la pagina, se renderiza el inventario inicial despues del login
  useEffect(() => {
    fetchProducts();
  }, []);


  // Elimina un vehículo por ID
  
  const handleDelete = async (id) => {
    try {
      if (!isAdmin) {
        setMessage("No tienes permisos para eliminar Vehículos"); // Solo admin tiene la facultadde eliminar ademas el backend vuelve a validar permisos
        return;
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }); // ruta protegida por JWT, y restringida solo a admin

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      // Si se aplica DELETE correctamente, se actualiza el estado local
      setProducts(products.filter((product) => product._id !== id)); // se saca del inventario el vehículo borrado 
      setMessage("Vehículo eliminado correctamente");
      setTimeout(() => setMessage(""), 3000); // 3 segs de mensaje de confirmación
    } catch (err) {
      setError("No se pudo eliminar el Vehículo");
    }
  };

  if (loading) {
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
      {error && <div className="alert alert-danger">{error}</div>} 
      {message && <div className="alert alert-info">{message}</div>}

      <h2 className="mb-4 text-center">Inventario de Vehículos</h2>

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

                  <td className="text-end">

                    {/* boton de visor (tanto admin como visor pueden verlo) */}
                    <a
                      href={`/products/${product._id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Ver
                    </a>
                    
                    {/* botones solo acceso admin "isAdmin*/}  

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
