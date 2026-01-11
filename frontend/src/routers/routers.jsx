import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "@/Layout/Layout.jsx";

// Lazy pages
const ProductsList = lazy(() => import("@/pages/ProductsList.jsx"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail.jsx"));
const ProductCreate = lazy(() => import("@/pages/ProductCreate.jsx"));
const Login = lazy(() => import("@/pages/Login.jsx"));
const Register = lazy(() => import("@/pages/Register.jsx"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers.jsx"));

// función para verificar autenticación
const isAuthenticated = () => !!localStorage.getItem("token");

// componente wrapper para rutas protegidas
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

// wrapper para Suspense (para no repetir fallback)
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
    ],
  },
]);




// import { createBrowserRouter, Navigate } from "react-router-dom";

// import Layout from "@/Layout/Layout.jsx";
// import ProductsList from "@/pages/ProductsList.jsx";
// import ProductDetail from "@/pages/ProductDetail.jsx";
// import ProductCreate from "@/pages/ProductCreate.jsx";
// import Login from "@/pages/Login.jsx";
// import Register from "@/pages/Register.jsx";
// import AdminUsers from "@/pages/AdminUsers.jsx";



// // función para verificar autenticación
// const isAuthenticated = () => !!localStorage.getItem("token");

// // componente wrapper para rutas protegidas
// const ProtectedRoute = ({ element }) => {
//   return isAuthenticated() ? element : <Navigate to="/login" replace />;
// };

// export const router = createBrowserRouter([
//   { path: "/login", element: <Login /> },
//   { path: "/register", element: <Register /> }, 

//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <ProtectedRoute element={<ProductsList />} />,
//       },
//       {
//         path: "/products",
//         element: <ProtectedRoute element={<ProductsList />} />,
//       },
//       {
//         path: "/products/:id",
//         element: <ProtectedRoute element={<ProductDetail />} />,
//       },
//       {
//         path: "/products/create/:id?",
//         element: <ProtectedRoute element={<ProductCreate />} />,
//       },

//       {
//         path: "/admin/users",
//         element: <ProtectedRoute element={<AdminUsers />} />,
//       },

      
//     ],
//   },
// ]);

