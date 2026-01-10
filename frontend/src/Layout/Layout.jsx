import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; /*@*/

/*@nuevo@*/
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

  const goToProducts = () => {
    navigate("/products");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <button type="button" className="navbar-brand btn btn-link text-white p-0" onClick={goToProducts}>
            Gestor de Productos
          </button>

          <div className="d-flex align-items-center">
            {isAuthenticated && (
              <>
                {isAdmin && (
                  <>
                    <span className="text-light me-3">Modo: Administrador</span>

                    <button
                      type="button"
                      className="btn btn-outline-info btn-sm me-2"
                      onClick={goToUsers}
                    >
                      Usuarios
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;


/*@*/

// const Layout = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = !!localStorage.getItem("token");
//   const isAdmin = localStorage.getItem("isAdmin") === "true";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isAdmin");
//     navigate("/login");
//   };

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container d-flex justify-content-between align-items-center">
//           <a className="navbar-brand" href="/products">
//             Gestor de Productos
//           </a>

//           {isAuthenticated && (
//             <div className="d-flex align-items-center">
//               {isAdmin && (
//                 <>
//                   <a
//                     href="/admin/users"
//                     className="btn btn-outline-light btn-sm me-3"
//                   >
//                     Panel Admin
//                   </a>
//                   <span className="text-light me-3">Modo: Administrador</span>
//                 </>
//               )}

//               <button
//                 className="btn btn-outline-light btn-sm"
//                 onClick={handleLogout}
//               >
//                 Cerrar sesión
//               </button>
//             </div>
//           )}
//         </div>
//       </nav>

//       <main className="container mt-4">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;

/*@*/