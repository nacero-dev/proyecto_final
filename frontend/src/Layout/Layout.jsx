import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


const Layout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth(); 
  // Se obtiene el estado de sesión desde AuthContext:
  // isAuthenticated: si hay token (usuario logGueado)
  // isAdmin: rol para mostrar acciones de administración
  // logout: función para cerrar sesión (limpia storage + estado)

  const handleLogout = () => {
    logout();
    navigate("/login");
  }; // Cierra Sesión y redirige al login utilizando ReactRouter

  const goToUsers = () => {
    navigate("/admin/users");
  }; // Navegación al panel de administración de usuarios

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> 
        {/* Navbar superior (Bootstrap) se muestra en las páginas internas una vez el usuario está dentro de la app https://getbootstrap.com/docs/4.6/components/navbar/*/} 

        <div className="container-fluid px-4">
          

          <a className="navbar-brand" href="/products"> 
            Inicio
          </a> {/* Link que lleva a la página de inicio */}

          <div className="d-flex">
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión

              </button>
            )} {/* botón de logout solo si está autenticado */}


          </div>
        </div>
      </nav>


      {/* Contenedor principal de contenido // container-fluid hace aprovechar todo el ancho (evita que quede “encajonado”) */}
                   
      <main className="container-fluid mt-4 px-4"> 
        {isAuthenticated && isAdmin && (
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={goToUsers}
            >
              Administrar usuarios
            </button>  {/* Botón de administracion: solo visible para admin para ir a la pagina de usuarios*/}
          </div> 
        )}

        <Outlet />  {/* Outlet: aquí React Router renderiza la página correspondiente a la ruta actual*/}
      </main>
    </div>
  );
};

export default Layout;

