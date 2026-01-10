import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@/Layout/Layout.jsx";
import ProductsList from "@/pages/ProductsList.jsx";
import ProductDetail from "@/pages/ProductDetail.jsx";
import ProductCreate from "@/pages/ProductCreate.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import AdminUsers from "@/pages/AdminUsers.jsx";



// función para verificar autenticación
const isAuthenticated = () => !!localStorage.getItem("token");

// componente wrapper para rutas protegidas
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }, 

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={<ProductsList />} />,
      },
      {
        path: "/products",
        element: <ProtectedRoute element={<ProductsList />} />,
      },
      {
        path: "/products/:id",
        element: <ProtectedRoute element={<ProductDetail />} />,
      },
      {
        path: "/products/create/:id?",
        element: <ProtectedRoute element={<ProductCreate />} />,
      },

      {
        path: "/admin/users",
        element: <ProtectedRoute element={<AdminUsers />} />,
      },

      
    ],
  },
]);

