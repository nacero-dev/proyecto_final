/* En el backend se separa la lógica en routers y controllers.
Los routers (backend/routers/) definen las rutas y aplican middlewares (JWT y roles).
Los controllers (backend/controllers/) contienen la lógica de cada endpoint (consultas a MongoDB con Mongoose, validaciones básicas y respuestas).
Esto mejora la organización y facilita el mantenimiento del código.
*/

const User = require("../models/user-model");

// Obtener todos los usuarios (solo admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Cambiar rol de usuario (admin <-> visor)
const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: "Rol actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

module.exports = {
  getUsers,
  toggleUserRole,
  deleteUser,
};
