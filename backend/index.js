require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Configurar CORS para permitir los dominios del frontend en Vercel
app.use(
  cors({
    origin: [
      "http://localhost:5173",                   // desarrollo local
      "https://proyecto-final-mu-dun.vercel.app",   // frontend desarrollo
      "https://proyecto-final-front-dev.vercel.app" // frontend producción
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware para leer JSON
app.use(express.json());

// Variables de entorno
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Falta la variable de entorno MONGO_URI");
  process.exit(1);
}

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  });

// Routers
const authRouter = require("./routers/authRouter");
const productsRouter = require("./routers/productsRouter");
const adminRouter = require("./routers/adminRouter");



// Rutas
app.use("/api", authRouter);
app.use("/products", productsRouter);
app.use("/admin", adminRouter);


// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API Gestor de Productos funcionando correctamente" });
});

// Ruta por defecto para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
