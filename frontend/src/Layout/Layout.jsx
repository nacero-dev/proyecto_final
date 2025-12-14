import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand" href="/products">
            Gestor de Productos
          </a>

          {isAuthenticated && (
            <div className="d-flex align-items-center">
              {isAdmin && (
                <>
                  <a
                    href="/admin/users"
                    className="btn btn-outline-light btn-sm me-3"
                  >
                    Panel Admin
                  </a>
                  <span className="text-light me-3">Modo: Administrador</span>
                </>
              )}

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

