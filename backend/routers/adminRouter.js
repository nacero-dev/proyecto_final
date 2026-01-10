const express = require("express");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get("/users", authMiddleware, roleMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // sin mostrar contraseñas
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Cambiar rol de usuario (admin <-> visor)
router.put("/users/:id/role", authMiddleware, roleMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: "Rol actualizado correctamente", user });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
});

// Eliminar usuario
router.delete("/users/:id", authMiddleware, roleMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

router.use(notFound);
router.use(errorHandler);

module.exports = router;
