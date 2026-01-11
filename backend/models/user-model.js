//Schema de usuario
//Define como se guarda un usuario
//Se utiliza en login y en registro y para controlar roles de admin y visor

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

//email
//Campos relevantes:
//unique: evita duplicados
//trim: elimina espacios por errores de dedo al inicio y finales de palabras
//required:true: es requerido el dato

//password
//Campos relevantes:
//required:true: es requerido el dato

//isAdmin
//Campos relevantes:
//default: false: todos los usuarios son creados como visores no como administradores

//timestamps: agrega fecha de creacion (CreatedAt) y fecha de ultima actualizacion (UpdatedAt)

const User = mongoose.model("User", userSchema); //esto permite utilizar metodos como User.find()

module.exports = User;
