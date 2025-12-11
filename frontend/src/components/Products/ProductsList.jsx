import { useEffect, useState } from "react";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.API_URL}/products`)
    .then(response => response.json())
    .then(data => setProducts(data))
    .catch(error => {
      console.error('error fetching products: ', error);
      setError(error)
    });
  
  if (error) {
    return <p>Error fetching products: {error.message}</p>
  }

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
