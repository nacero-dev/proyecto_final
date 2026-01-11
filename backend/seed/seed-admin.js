const bcrypt = require("bcryptjs");
const User = require("../models/user-model");


//con el seed admin se asegura que siempre se cuente con al menos 1 usuario admin creado automaticamene, es importante por que es quien da siguientes accesos y puede ejecutar el CRUD 

const seedAdminUser = async () => {
  const email = process.env.ORIGIN_ADMIN_EMAIL; //estos son los accesos para el admin que se encuentran en .env y vercel como variables de entorno
  const password = process.env.ORIGIN_ADMIN_PASSWORD;
  
  if (!email || !password) return; //filtro que si no se tienen los accesos se acabe la ejecución

  const existingUser = await User.findOne({ email });  // se verifica si ya se tiene un email de admin seed para no duplicar y siga vigente el original
  if (existingUser) return;

  const hashedPassword = await bcrypt.hash(password, 10); //guardado de la contraseña hashed 


  // se crea en mongo el admin seed
  await User.create({
    email,
    password: hashedPassword,
    isAdmin: true,
  });
};

module.exports = seedAdminUser;
