const express = require("express");
const router = express.Router();
const { register, login, registerWithRole } = require("../controllers/authController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

router.post("/register", register); // Registro normal (solo 'patient' por defecto)
router.post("/register-with-role", authMiddleware, authorize(['admin']), registerWithRole); // Registro con rol específico
router.post("/login", login); // Inicio de sesión

module.exports = router;
