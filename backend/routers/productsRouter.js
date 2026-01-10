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











// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Product = require("../models/productsModel");
// const authMiddleware = require("../middlewares/authMiddleware");
// const notFound = require("../middlewares/not-found");
// const errorHandler = require("../middlewares/error-handler");

// // Todas las rutas de productos requieren estar autenticado
// router.use(authMiddleware);

// // Obtener todos los productos
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener productos" });
//   }
// });

// // Obtener un producto por ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Producto no encontrado" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener producto" });
//   }
// });

// // Crear un producto (solo admin)
// router.post("/", async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Solo los administradores pueden crear productos" });
//     }

//     const newProduct = new Product(req.body);
//     const savedProduct = await newProduct.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     res.status(400).json({ message: "Error al crear producto", error });
//   }
// });

// // Actualizar un producto (solo admin)
// router.put("/:id", async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Solo los administradores pueden editar productos" });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Producto no encontrado" });
//     }
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: "Error al actualizar producto" });
//   }
// });

// // Eliminar un producto (solo admin)
// router.delete("/:id", async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Solo los administradores pueden eliminar productos" });
//     }

//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Producto no encontrado" });
//     }
//     res.json({ message: "Producto eliminado correctamente" });
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar producto" });
//   }
// });

// router.use(notFound);
// router.use(errorHandler);

// module.exports = router;
