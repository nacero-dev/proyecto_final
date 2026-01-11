const jwt = require("jsonwebtoken");
// authMiddleware: valida sesión (token)
// roleMiddleware: valida permiso (admin)
//Este es el middlewate de JWT el cual protege a las rutas de intrusos verificando el token asignado a quienes tienen acceso
const authMiddleware = (req, res, next) => {
  
  const authHeader = req.headers.authorization; //solicitud del token JWT

  if (!authHeader || !authHeader.startsWith("Bearer ")) { // en caso de no obtener el token del header o se detecta algun tema en el formato que correspondería, se da por negado el acceso e impide al usuario de continuar por la ruta protegida
    return res.status(401).json({ message: "Acceso no autorizado, token no enviado" });
  }

  const token = authHeader.split(" ")[1]; //esto sirve en la obtencion del token ya que viene ligado con el término "bearer" el token y hay que separarlos

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifica la vigencia del token y su contenido este firmado por JWT_SECRET https://app.unpkg.com/jsonwebtoken%409.0.3/files/README.md
    req.user = decoded; // Guarda los datos del usuario en la request para poderse ocupar en las rutas
    next(); //permite la continuidad del codigo hacia el siguiente hito
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" }); // en caso de no seguir en el next() se lanza uun status 403 FORBIDDEN 
  }
};



module.exports = authMiddleware;
