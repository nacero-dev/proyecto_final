// Controller de administracion de usuarios
// El control de acceso (JWT + rol admin) se aplica en el router con authMiddleware y roleMiddleware y en este punto ya se tiene acceso al control de usuarios

const User = require("../models/user-model");

// Devuelve la lista de usuarios registrados
// Excluye el campo password por seguridad
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); //trae a todos los usuarios registrados -password  evita devolver la contraseña 
    res.json(users); // se obtiene el JSON para poder renderizar la lista de usuarios
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" }); 
  }
};

// Modificacion de roles (visor/admin)
const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //se busca el id del usuario a modificar :id/role
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isAdmin = !user.isAdmin; //alternacion de valor booleano entre administrador y visor
    await user.save(); //guarda cambios en MongoDB
    
    res.json({ message: "Rol actualizado correctamente", user }); 
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

// Eliminar usuario
// Elimina un usuario por su id

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); //Encuentra el id del usuario y lo elimina (el documento)
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" }); //en caso de que el usuario no exista no se puede eliminar por lo tanto 404 NOT FOUND
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

module.exports = { getUsers, toggleUserRole, deleteUser,};
