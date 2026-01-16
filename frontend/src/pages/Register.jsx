// Página de registro
// Crea un usuario nuevo (visor) llamando al backend
// Luego muestra un mensaje para que el usuario inicie sesión

import { useState } from "react";
import { API_URL } from "@/const/api";

import { useError } from "@/hooks/useError";
import { useMessage } from "@/hooks/useMessage";
import { useLoading } from "@/hooks/useLoading";


const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" }); // Estads del formulario/

  const error = useError("");
  const success = useMessage("");
  const loading = useLoading(false);


  // Manejador de cambios del formulario (email/password), pone los vlores en el set del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador del submit que envía el registro al backend, el body viaja como texto en formato JSON (JSON.stringify) y el backend lo interpreta con express.json()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se limpian mensajes 

    error.clear();
    success.clear();
    loading.set(true);

    try {
      
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), 
      }); 
      // se hace peticion POST a /api/register para crea un usuario (visor por defecto)
      // // El body se envía como texto en formato JSON usando JSON.stringify(form)


      // La respuesta del backend llega en JSON y se convierte a objeto con response.json(), desplegando mensajes que ya estan configurados segun el caso en los controllers
      const data = await response.json();

      // Si la respuesta no es OK, da mensaje que venga del backend (de la seccion register "registerUser" o lance un mensaje que hubo error de registro
      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      // Si todo salió bien, mostraremos feedback positivo y se hace limpieza del formulario setForm("")

      success.set("Usuario registrado correctamente. Ahora puedes iniciar sesión");
      setForm({ email: "", password: "" });
    } catch (err) {
      //mensaje de error de registro
      error.set(err.message);
      } finally {
      loading.set(false);
    }
  };

  return (


  // Configuacion replica en login, se explica en login

  <div className="min-vh-100 d-flex flex-column flex-lg-row w-100 overflow-hidden">
    

    <div
      className="d-flex flex-column"
      style={{ width: "100%" }}
    >
      <div style={{ height: "35vh", overflow: "hidden" }} className="d-lg-none">
        <img src="/vehicles/hero.webp" alt="SuperAutos" className="w-100 h-100" style={{ objectFit: "cover" }}/>
      </div>

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

    <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h2 className="text-center mb-4">Registro de nuevo usuario</h2>

        {error.value && <div className="alert alert-danger">{error.value}</div>}
        {success.value && <div className="alert alert-success">{success.value}</div>}

        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required disabled={loading.value}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required disabled={loading.value}/>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Crear cuenta
          </button>

          <p className="text-center mt-3">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-primary">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>

    <style>{`
      @media (min-width: 992px) {
        .min-vh-100 > div:first-child { width: 60vw !important; }
      }
    `}</style>
  </div>
);

};

export default Register;