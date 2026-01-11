// este Middleware permite el acceso solo a administradores

const roleMiddleware = (req, res, next) => {
  

  if (!req.user || !req.user.isAdmin) { //en caso de que no sea usuario o admin entonces se impide el paso y se piden permisos de administrador, la principal diferencia es que aqui se cuestiona el rol "admisnitrador" mientras que en auth-middleware cuestiona si se tiene un token para dar acceso 
    return res.status(403).json({ message: "Acceso denegado: se requieren permisos de administrador." });
  }
  next();
};

module.exports = roleMiddleware;
