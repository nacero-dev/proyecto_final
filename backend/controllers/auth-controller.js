const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authCheck = (req, res) => {
  res.json({ message: "Auth router activo" });
};

// Registrar nuevo usuario (por defecto visor)
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Login y generar token JWT
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login correcto",
      token,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = {
  authCheck,
  registerUser,
  loginUser,
};
