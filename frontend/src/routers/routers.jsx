// Este es el enrutador principal de la aplicación
// Se definen las rútas públicas (login/register) y las rutas privadas (inventario/admin)
// También se usa lazy loading + Suspense para cargar páginas bajo demanda y mejorar rendimiento


import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "@/Layout/Layout.jsx";

// Lazy pages: se cargan solo cuando el usuario entra a la ruta dando un buen rendimiento a la pagina https://react.dev/reference/react/lazy
const ProductsList = lazy(() => import("@/pages/ProductsList.jsx"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail.jsx"));
const ProductCreate = lazy(() => import("@/pages/ProductCreate.jsx"));
const Login = lazy(() => import("@/pages/Login.jsx"));
const Register = lazy(() => import("@/pages/Register.jsx"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers.jsx"));
const Contact = lazy(() => import("@/pages/Contact.jsx")); /*@*/

// función para verificar autenticación en caso de que exista el token en local storage 
const isAuthenticated = () => !!localStorage.getItem("token");

// componente wrapper para rutas protegidas
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
}; //en caso de que el usuario no esté loggeado se readirige a la pagina de login

// Suspense es la pantalla de espera de React solo cuando una pagina tarda en cargar  https://react.dev/reference/react/Suspense
// se muestra un spinner que muestra mientras carga un icono de Bootstrap que gira https://react-bootstrap-v5.netlify.app/components/spinners
// clase de Bootstrap para ocultar texto visualmente pero mantenerlo accesible para lectores de pantalla para asegurar accesibilidad https://getbootstrap.com/docs/5.0/helpers/visually-hidden/
// se hace un wrapper para suspense y asi no se repite el mismo fallback en cada ruta 

const withSuspense = (element) => (
  <Suspense
    fallback={
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    }
  >
    {element}
  </Suspense>
);



export const router = createBrowserRouter([
  { path: "/login", element: withSuspense(<Login />) },
  { path: "/register", element: withSuspense(<Register />) },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: withSuspense(<ProtectedRoute element={<ProductsList />} />),
      },
      {
        path: "/products",
        element: withSuspense(<ProtectedRoute element={<ProductsList />} />),
      },
      {
        path: "/products/:id",
        element: withSuspense(<ProtectedRoute element={<ProductDetail />} />),
      },
      {
        path: "/products/create/:id?",
        element: withSuspense(<ProtectedRoute element={<ProductCreate />} />),
      },
      {
        path: "/admin/users",
        element: withSuspense(<ProtectedRoute element={<AdminUsers />} />),
      },
      /*@*/
      {
        path: "/contact",
        element: withSuspense(<ProtectedRoute element={<Contact />} />),
      },
      /*@*/
    ],
  },
]);

//  Rutas públicas donde tambien ocupan suspense
//  { path: "/login", element: withSuspense(<Login />) },
//  { path: "/register", element: withSuspense(<Register />) },

//  Rutas protegidas con suspense:
//  Se renderizan dentro de <Layout /> usando <Outlet />

//   path: "/" - Ruta raíz: muestra lista de productos si está autenticado
//   path: "/products" - Lista de inventario
//   path: "/products/:id" - Detalle de un producto/vehículo por id
//   path: "/products/create/:id?" - Crear o editar (opcional con id)
//   path: "/admin/users" - Administración de usuarios
//   path: "/contact" - Contactar al administrador para interés en vehiculo