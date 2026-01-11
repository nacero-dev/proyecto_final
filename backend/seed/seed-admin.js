const bcrypt = require("bcryptjs");
const User = require("../models/user-model");

const seedAdminUser = async () => {
  const email = process.env.ORIGIN_ADMIN_EMAIL;
  const password = process.env.ORIGIN_ADMIN_PASSWORD;
  
  if (!email || !password) return;

  const existingUser = await User.findOne({ email });
  if (existingUser) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    isAdmin: true,
  });
};

module.exports = seedAdminUser;
