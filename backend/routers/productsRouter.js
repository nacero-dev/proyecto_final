const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// Todas las rutas de productos requieren estar autenticado
router.use(authMiddleware);

// Obtener todos los productos
router.get("/", getProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Crear un producto (solo admin)
router.post("/", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden crear productos" });
  }
  return createProduct(req, res);
});

// Actualizar un producto (solo admin)
router.put("/:id", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden editar productos" });
  }
  return updateProduct(req, res);
});

// Eliminar un producto (solo admin)
router.delete("/:id", (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden eliminar productos" });
  }
  return deleteProduct(req, res);
});

router.use(notFound);
router.use(errorHandler);

module.exports = router;