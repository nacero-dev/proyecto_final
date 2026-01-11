const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const { getUsers, toggleUserRole, deleteUser,} = require("../controllers/admin-controller");

// aqui se establecen las rutas particulares al administrador en cuanto a gestion de usuarios
// getUsers: lista de usuarios registrados
// toggleUserRole: cambia rol a usuario entre admin o visor
// deleteUser: elimina usuarios

const router = express.Router();

//para acceder a la informacion todas requieren tener permisos de administrador especificado en authMiddleware, roleMiddleware

// Obtener todos los usuarios (solo admin)
router.get("/users", authMiddleware, roleMiddleware, getUsers);

// Cambiar rol de usuario
router.put("/users/:id/role", authMiddleware, roleMiddleware, toggleUserRole);

// Eliminar usuario
router.delete("/users/:id", authMiddleware, roleMiddleware, deleteUser);

router.use(notFound);
router.use(errorHandler);

module.exports = router;