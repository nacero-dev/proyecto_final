import { useState } from "react";
import { API_URL } from "@/const/api";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      setSuccess("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex w-100 overflow-hidden">
      {/* Columna izquierda (solo desktop) */}
      <div style={{ width: "60vw" }} className="d-none d-lg-flex flex-column">
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

      {/* Columna derecha */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 className="text-center mb-4">Registro de nuevo usuario</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="mx-auto">
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                required
              />
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
    </div>
  );
};

export default Register;