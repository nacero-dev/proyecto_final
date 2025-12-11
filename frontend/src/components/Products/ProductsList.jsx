import { useEffect, useState } from "react";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([
      { _id: "1", name: "Producto A", price: 10, stock: 5 },
      { _id: "2", name: "Producto B", price: 20, stock: 3 }
    ]);
  }, []);

  return (
    <div>
      <h2>Lista de productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {products.map((product) => (
            <li key={product._id} style={{ marginBottom: "1rem" }}>
              <strong>{product.name}</strong> - {product.price} € (Stock: {product.stock}){" "}
              <a href={`/products/${product._id}`}>Ver</a>{" "}
              <a href={`/products/create/${product._id}`}>Editar</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
