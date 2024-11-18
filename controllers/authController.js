const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password } = req.body; // Eliminamos 'role' de la desestructuración

  // Validación básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." }); // Manejo de duplicados
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Asignar el rol 'patient' por defecto
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'patient' // Establecer el rol predeterminado
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(400).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generar el token con userId y role
      const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.json({ token });
  } catch (error) {
      console.error('Login failed:', error);
      res.status(400).json({ error: "Login failed" });
  }
};

exports.registerWithRole = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Verificar que solo el admin pueda acceder a este endpoint
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied" });
  }

  // Validación de entrada
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Name, email, password, and role are required." });
  }

  if (!['admin', 'doctor', 'patient'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario con el rol especificado
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error en el registro con rol:", error);
    res.status(400).json({ error: "User registration failed" });
  }
};
