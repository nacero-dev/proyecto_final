import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; 


const Layout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToUsers = () => {
    navigate("/admin/users");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/products">
            Gestor de Productos
          </a>

          <div className="d-flex">
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        {isAuthenticated && isAdmin && (
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={goToUsers}
            >
              Administrar usuarios
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

