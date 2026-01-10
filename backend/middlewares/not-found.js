const notFound = (req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "Ruta no encontrada",
  });
};

module.exports = notFound;
