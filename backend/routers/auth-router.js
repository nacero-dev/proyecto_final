const express = require("express");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const {
  authCheck,
  registerUser,
  loginUser,
} = require("../controllers/auth-controller");

const router = express.Router();

router.get("/", authCheck);

// Registrar nuevo usuario (por defecto visor)
router.post("/register", registerUser);

// Login y generar token JWT
router.post("/login", loginUser);

router.use(notFound);
router.use(errorHandler);

module.exports = router;