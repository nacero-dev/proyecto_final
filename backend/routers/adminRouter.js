const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const {
  getUsers,
  toggleUserRole,
  deleteUser,
} = require("../controllers/adminController");

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get("/users", authMiddleware, roleMiddleware, getUsers);

// Cambiar rol de usuario (admin <-> visor)
router.put("/users/:id/role", authMiddleware, roleMiddleware, toggleUserRole);

// Eliminar usuario
router.delete("/users/:id", authMiddleware, roleMiddleware, deleteUser);

router.use(notFound);
router.use(errorHandler);

module.exports = router;