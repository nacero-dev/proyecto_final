
// Vista de administración de usuarios
// Permite al admin ver usuarios, cambiar roles (admin/visor) y eliminar usuarios

import { useEffect, useState } from "react";
import { API_URL } from "@/const/api";

// Lista de usuarios obtenida del backend
const AdminUsers = () => {

  // Lista de usuarios obtenida del backend
  const [users, setUsers] = useState([]);

  // Error para mostrar mensajes cuando falla una petición
  const [error, setError] = useState("");

  // Mensajes informativos de estado para el usuario
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado de carga para mostrar spinner mientras se consulta el backend
  const token = localStorage.getItem("token");

  // Se guarda Token JWT en localStorage 
  // Consulta todos los usuarios al backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // JWT requerido para autorización
      if (!res.ok) throw new Error("Error al cargar los usuarios");
      const data = await res.json(); // La respuesta llega en JSON y se convierte a objeto con res.json()
      setUsers(data); // Se guarda la lista para renderizarla en la tabla
    } catch (err) {
      setError(err.message); // Guarda el mensaje de error para mostrarlo en pantalla
    } finally {
      setLoading(false); // Se desactiva el loading siempre
    }
  };

  // Cambia el rol de un usuario entre admin y visor
  const toggleRole = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }); // JWT requerido

      if (!res.ok) throw new Error("Error al cambiar rol");
      setMessage("Rol de usuario actualizado correctamente"); // Mensaje de confirmacion de cambio de rol que se oculta luego de 3 segundos
      setTimeout(() => setMessage(""), 3000);

      fetchUsers();  // Se vuelve a renderizarla lista de usuarios creados para ver reflejado el cambio de rol
    } catch (err) {
      setError(err.message);
    }
  };

  // Elimina un usuario por ID
  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsers(users.filter((user) => user._id !== id)); // Actualiza la lista de usuarios eliminando el usuario del estado sin recargar toda la página

      // Mensaje de confirmación y se oculta luego de 3 segundos
      setMessage("Usuario eliminado correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Solicitud de traer todos los usuarios
  useEffect(() => {
    fetchUsers();
  }, []);


  // spinner de carga
  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );


  return (
    <div className="container mt-4">

      {/* Alertas para errores y mensajes de éxito */}

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <h2 className="text-center mb-4">Panel de administración de usuarios</h2>

      {/* Tabla Bootstrap con los usuarios */}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>

            {/* Se renderiza una fila por usuario */}

            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>

                {/* El rol se interpreta desde user.isAdmin */}
                <td>{user.isAdmin ? "Administrador" : "Visor"}</td>

                <td>
                  <div className="d-grid gap-2 d-sm-flex">


                    {/* onClick para cambiar rol alternando entre admin y visor */}
                    <button
                      onClick={() => toggleRole(user._id)}
                      className="btn btn-sm btn-warning"
                      type="button"
                    >
                      Cambiar rol
                    </button>

                    {/* onClick para eliminar usuario de la base de datos */}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="btn btn-sm btn-danger"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
