// Middleware global de manejo de errores
// Express lo ejecuta cuando algún endpoint llama a next(err) o cuando ocurre un error y no se quiere especificar que es exactamente 

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: "Error interno del servidor",
  });
};

module.exports = errorHandler;
