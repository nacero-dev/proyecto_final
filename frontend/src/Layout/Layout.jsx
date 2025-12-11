import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav style={{ textAlign: "center", marginBottom: "2vh" }}>
        <Link to="/products" style={{ marginRight: "2vw" }}>
          Lista de productos
        </Link>
        <Link to="/products/create">
          Crear producto
        </Link>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
