const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

// comprobacion que la autenticación esta funcionando

const authCheck = (req, res) => {
  res.json({ message: "Auth router activo" });
};

// Control de Registrar nuevo usuario (por defecto asigna rol de visor anuevos)

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" }); //Valida que existan campos de email y password en formulario de registro
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" }); //validación que no exista algun usuario con el mismo email
    }

    const hashedPassword = await bcrypt.hash(password, 10); //guardar en base de datos contraseñas hash para no poder ser leidas por cualquiera

    const newUser = new User({
      email,
      password: hashedPassword,
    });  // se crea un usuario nuevo con su propio email y password asignado

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" }); // si todo ok 201 "creado"
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" }); // si algo falla error generico 500 sin dar exactamente detalle de que es la causa 
  }
};

// Control de Login y generación de token JWT

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" }); //validacion de datos completos email y password
    }

    const user = await User.findOne({ email }); // revisa que exista el email en la base de datos en caso contrario 401
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password); //se verifica la contrasña (ya hasheada) con la que proporciona el usuario en texto plano, en caso negativo se deniega el acceso
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ); // se genera el token y se firma con los detalles del usuario limitando su vigencia a 1 hra

    res.json({
      message: "Login correcto",
      token,
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = {authCheck, registerUser, loginUser,};
