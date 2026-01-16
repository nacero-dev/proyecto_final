// Página de Login
// validacion al usuario contra el backend, recibe el token JWT, lo guarda en AuthContext y redirige al inventario

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/const/api";


// Hooks personalizados
import { useError } from "@/hooks/useError"; 
import { useLoading } from "@/hooks/useLoading"; 
import { useMessage } from "@/hooks/useMessage"; 

const Login = () => {
  const navigate = useNavigate(); // Hook de navegación para redirigir sin recargar la página

  const { login } = useAuth(); // Función login del contexto: guarda token/isAdmin en localStorage y en el estado global

  // Estado del formulario
  const [form, setForm] = useState({ email: "", password: "" });


  // Estados reutilizables (en lugar de useState repetidos)
  const error = useError("");        // Mensajes de error
  const success = useMessage("");    // Mensajes de éxito
  const loading = useLoading(false); // Bloquea inputs/botones durante la petición


  // Manejador de cambios del formulario 
  // e.target.name coincide con "email" o "password" según el input

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   // subnmit de credenciales al backend y manejo de respuesta
   const handleSubmit = async (e) => {
    e.preventDefault();   

    // // Limpia mensajes previos y activa loading
    // setError("");
    // setSuccess("");
    // setLoading(true);

     // Limpieza de mensajes antes de intentar login
    error.clear();
    success.clear();
    loading.set(true);

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

      // Guardamos el email usado en login para reutilizarlo en Contact
      localStorage.setItem("userEmail", form.email);

      // Mensaje de éxito de inicio y redirección al inventario
      success.set("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate("/products");
      }, 600); // se hace una pausa de 0.6 segs para UX en donde se pueda ver el mensaje de inicio de sesión
    } catch (err) {
      // Muestra el error de credenciales o de servidor
      error.set(err.message);
    } finally {
      // Se apaga loading siempre (haya éxito o error)
      loading.set(false); 
    }
  };

  return (

  // Configuacion responsive en móvil se apilan hero arriba y formulario abajo en desktop son dos columnas lado a lado

  <div className="min-vh-100 d-flex flex-column flex-lg-row w-100 overflow-hidden">
    
    <div
      className="d-flex flex-column"
      style={{ width: "100%" }}
    >
      {/* Hero movil más compacto para no ocupar toda la pantalla */}
      <div style={{ height: "35vh", overflow: "hidden" }} className="d-lg-none">
        <img src="/vehicles/hero.webp" alt="SuperAutos" className="w-100 h-100" style={{ objectFit: "cover" }}/>
      </div>

      {/* Hero desktop*/}
      <div style={{ height: "50vh", overflow: "hidden" }} className="d-none d-lg-block">
        <img src="/vehicles/hero.webp" alt="SuperAutos" className="w-100 h-100" style={{ objectFit: "cover" }}/>
      </div>

      <div
        className="d-flex align-items-center justify-content-center text-white"
        style={{ backgroundColor: "#0f4c5c", flex: 1 }}
      >
        <div className="text-center p-4">
          <h1 className="display-4 fw-bold mb-0">SuperAutos</h1>
          <h2 className="display-5 fw-light">
            "Los mejores vehículos exóticos, excelente precio y alta calidad"
          </h2>
        </div>
      </div>
    </div>

    {/* Columna derecha: formulario de inicio */}
    <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        {/* Mensajes de estado */}
        {error.value && <div className="alert alert-danger">{error.value}</div>}
        {success.value && <div className="alert alert-success">{success.value}</div>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required disabled={loading.value}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required disabled={loading.value}/>
          </div>

          {/* Botón deshabilitado durante loading para evitar doble envío https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading.value}>
            {loading.value ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Enlace a registro de usuarios */}
          <p className="text-center mt-3">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-primary">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>

    {/* @media query para desktop*/}
    <style>{`
      @media (min-width: 992px) {
        .min-vh-100 > div:first-child { width: 60vw !important; }
      }
    `}</style>
  </div>
);

};

export default Login;
