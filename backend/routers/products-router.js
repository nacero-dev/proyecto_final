const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");


const { getProducts, createProduct, getProductById, updateProduct, deleteProduct, filterProducts } = require("../controllers/products-controller");

// aqui se controla quien ve que de acuerdo al rol que tiene (inventario de vehículos):
// getProducts: obtener todo el inventario
// filterProducts: filtrado por operadores de MongoDB
// getProductById: detalle por id
// createProduct, updateProduct, deleteProduct: CRUD (acciones protegidas para admin)

// Se establece de entrada la condicion de que todas las rutas requieren estar autenticado, se ejecuta en caso inexistente de autorizacion ({ message: "Acceso no autorizado, token no enviado" }); O ({ message: "Token inválido o expirado" }) segun sea el caso dentreo de ese middleware
router.use(authMiddleware);

// Obtener todos los vehículos
router.get("/", getProducts);

// filtro por operadores de Mongo como q, minPrice, etc
router.get("/filter", filterProducts);

// Obtener un vehiculo por ID (da el detalle del vehiculo "la card")
router.get("/:id", getProductById);

// Apartir de aqui es CRUD SOLO ADMIN!:

// Crear un vehiculo (solo admin tiene acceso a añadir vehiculo), se valida si tiene los accesos del token en caso contrario es error 403
router.post("/", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden crear vehiculos" });
  }
  return createProduct(req, res);
});

// Actualizar un vehiculo (solo admin tiene acceso a editar vehiculos)
router.put("/:id", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden editar vehiculos" });
  }
  return updateProduct(req, res);
});

// Eliminar un vehiuculo (solo admin)
router.delete("/:id", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden eliminar vehiculos" });
  }
  return deleteProduct(req, res);
});

router.use(notFound);
router.use(errorHandler);

module.exports = router;