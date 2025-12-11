// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Crear la aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Variables de entorno
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch((error) => console.error("Error al conectar con MongoDB:", error));

// Rutas
const productsRouter = require("./routers/productsRouter");
app.use("/products", productsRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API Gestor de Productos funcionando correctamente" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
