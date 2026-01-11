const express = require("express");
const notFound = require("../middlewares/not-found");
const errorHandler = require("../middlewares/error-handler");

const { authCheck, registerUser, loginUser, } = require("../controllers/auth-controller");

// aqui se establecen los principales accesos registro o inicio de sesion
// authCheck comprobar si la API sigue viva https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
//registerUser crea un usuario (visor por defecto)
// loginUser valida credenciales y devuelve JWT 


const router = express.Router();

router.get("/", authCheck);

// Registrar nuevo usuario (por defecto tendra rol de visor)
router.post("/register", registerUser);

// Login y generar token JWT
router.post("/login", loginUser);

router.use(notFound);
router.use(errorHandler);

module.exports = router;