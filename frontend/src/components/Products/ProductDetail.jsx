import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  // Más adelante aquí haremos un fetch a la API con el id.
  return (
    <div>
      <h2>Detalle del producto</h2>
      <p>ID del producto: {id}</p>
      <p>(Más adelante mostraremos los datos reales desde la API)</p>
    </div>
  );
};

export default ProductDetail;
