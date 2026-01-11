require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");


const app = express();

app.use(helmet());
app.use(morgan("dev"));

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

// Middlewares de errores
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
