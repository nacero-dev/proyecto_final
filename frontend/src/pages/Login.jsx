// Página de Login
// validacion al usuario contra el backend, recibe el token JWT, lo guarda en AuthContext y redirige al inventario

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/const/api";

const Login = () => {
  const navigate = useNavigate(); // Hook de navegación para redirigir sin recargar la página

  const { login } = useAuth(); // Función login del contexto: guarda token/isAdmin en localStorage y en el estado global

  // Estado del formulario
  const [form, setForm] = useState({ email: "", password: "" });

  // Estados que dab avisos al usuario
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // loading bloquea inputs botones en lo que se procesa login
  const [loading, setLoading] = useState(false);


  // Manejador de cambios del formulario 
  // e.target.name coincide con "email" o "password" según el input

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   // subnmit de credenciales al backend y manejo de respuesta
   const handleSubmit = async (e) => {
    e.preventDefault();   

    // Limpia mensajes previos y activa loading
    setError("");
    setSuccess("");
    setLoading(true);

    try {

      // Se envía una petición POST a /api/login
      // El body se envía como texto en formato JSON usando JSON.stringify(form)
      // En el backend, Express lo interpreta como objeto por medio de express.json()
      // La respuesta llega como texto JSON y en el frontend la convertimos a objeto con response.json() "parse", para leer token/isAdmin/message

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }
      // Guarda sesión token y rol en AuthContext localStorage
      login({ token: data.token, isAdmin: data.isAdmin });

      // Mensaje de éxito de inicio y redirección al inventario
      setSuccess("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate("/products");
      }, 600); // se hace una pausa de 0.6 segs para UX en donde se pueda ver el mensaje de inicio de sesión
    } catch (err) {
      // Muestra el error de credenciales o de servidor
      setError(err.message);
    } finally {
      // Se apaga loading siempre (haya éxito o error)
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex w-100 overflow-hidden">
      <div style={{ width: "60vw" }} className="d-none d-lg-flex flex-column">{/* Responsive config d-none d-lg-flex: Columna izquierda (solo se muestra en desktop "desde d-none hasta "lg" se muestra") */}
        <div style={{ height: "50vh", overflow: "hidden" }}>
          <img
            src="/vehicles/hero.webp"
            alt="SuperAutos"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />        
        </div>

        <div
          className="d-flex align-items-center justify-content-center text-white"
          style={{ backgroundColor: "#0f4c5c", flex: 1 }}
        >
          <div className="text-center p-4">
            <h1 className="display-4 fw-bold mb-0">SuperAutos</h1>
            <h2 className="display-5 fw-light">Portal de Empresa</h2>
          </div>
        </div>
      </div>

      {/* Columna derecha: formulario de inicio, flex-grow-1: ocupa el espacio restante (en móvil ocupa todo width: "100%", maxWidth: "420px) */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 className="text-center mb-4">Iniciar sesión</h2>

          {/* Mensajes de estado */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Formulario controlado */}
          <form onSubmit={handleSubmit} className="mx-auto">
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required disabled={loading}/>
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required disabled={loading}/>
            </div>

            {/* Botón deshabilitado durante loading para evitar doble envío https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled */}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {/* Enlace a registro de ususarips*/}
            <p className="text-center mt-3">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-primary">
                Regístrate aquí
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
