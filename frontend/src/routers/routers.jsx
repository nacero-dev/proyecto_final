import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout.jsx";

import ProductsList from "../components/Products/ProductsList.jsx";
import ProductDetail from "../components/Products/ProductDetail.jsx";
import ProductCreate from "../components/Products/ProductCreate.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProductsList />,
      },
      {
        path: "/products",
        element: <ProductsList />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/products/create/:id?",
        element: <ProductCreate />,
      },
    ],
  },
]);
