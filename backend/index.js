// index.js es el punto de entrada del backend

// aqui se configuran middlewares globales, conexión a MongoDB y las rutas, ejecuta tambien el administrador inciail "seed"
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const seedAdminUser = require("./seed/seed-admin"); // crea un adminisrador inicial si no existe 

const app = express();

//Middlewares globales
app.use(helmet()); // helmet: ayufa en la depuración y tener instalados modulos en respectivos entornos
app.use(morgan("dev"));  // morgan: registra cada request en lugar de utilizar console.log

//  CORS sirve para permitir los dominios del frontend en Vercel, el navegador bloqueará sino esta permitido 
//  en consola CORS POLICY NOT ALLOWED
app.use(
  cors({
    origin: [
      "http://localhost:5173",                   // desarrollo local
      "https://proyecto-final-mu-dun.vercel.app",   // frontend de desarrollo
      "https://proyecto-final-front-dev.vercel.app" // frontend de producción
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware para leer JSON de lo que viene ens sus bodies como las requests (POST/PUT)
app.use(express.json());

// Variables de entorno que se encuentran en el archivo .env (localmente no se sube a Github es sensible y se logra por medio de gitignore) y tambien se alojan en vercel
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// condicional si no existe MONGO_URI entonces no se puede conectar con la base de datos.
if (!MONGO_URI) {
  process.exit(1);
}

//process.exit(1) termina el proceso de Node.js inmediatamente y devuelve un código de salida al sistema operativo.
//process.exit(0) suele significar “salí bien / sin errores”.
//process.exit(1) significa “salí por error” (fallo). Es un código “no cero”, y por convención indica error.
//https://nodejs.org/api/process.html#processexitcode


// enlace node con mongo Atlas , conecta a la base de datos, en caso de que no exista ejecuta a admin seed
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado correctamente");

    try {
      await seedAdminUser();
    } catch (error) {
      console.log("Seed admin falló");// el catch evita que frene la ejecución del codigo en caso de que seed falle
    }
  })
  
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  });


// Routers-separacion de la ruta de autorizacion, productos, o administrador
const authRouter = require("./routers/auth-router");
const productsRouter = require("./routers/products-router");
const adminRouter = require("./routers/admin-router");


// aqui se establece montaje de la rutas
app.use("/api", authRouter);
app.use("/products", productsRouter);
app.use("/admin", adminRouter);


// Ruta raíz, el endpoint comprueba a su vez que la API esta corriendo ok
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// Middlewares de errores
const notFound = require("./middlewares/not-found"); //se asocia con el status 404 cuando la ruta NOT FOUND
const errorHandler = require("./middlewares/error-handler"); //se asocia con el status 500 INTERNAL SERVER ERROR
 
app.use(notFound); 
app.use(errorHandler); 

// Iniciar servidor necesario en terminal para saber si esta corriendo ok
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
