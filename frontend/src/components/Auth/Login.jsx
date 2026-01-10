import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      login({ token: data.token, isAdmin: data.isAdmin });

      setSuccess("Inicio de sesión exitoso.");
      setTimeout(() => {
        navigate("/products");
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="text-center mt-3">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-primary">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;


/*@ cambiar @*/
// import { useState } from "react";

// const Login = () => {
//     const [form, setForm] = useState({ email: "", password: "" });
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(form),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Error al iniciar sesión");
//             }

//             // Guardar token y rol en localStorage
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("isAdmin", data.isAdmin);

//             setSuccess("Inicio de sesión exitoso.");
//             setTimeout(() => {
//                 window.location.href = "/products"; // redirige a la lista de productos
//             }, 1000);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Iniciar sesión</h2>

//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}

//             <form
//                 onSubmit={handleSubmit}
//                 className="mx-auto"
//                 style={{ maxWidth: "400px" }}
//             >
//                 <div className="mb-3">
//                     <label className="form-label">Correo electrónico</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Contraseña</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={form.password}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     />
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100">
//                     Iniciar sesión
//                 </button>

//                 <p className="text-center mt-3">
//                     ¿No tienes cuenta?{" "}
//                     <a href="/register" className="text-primary">
//                         Regístrate aquí
//                     </a>
//                 </p>


//             </form>
//         </div>
//     );
// };

// export default Login;
