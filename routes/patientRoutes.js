const express = require("express");
const router = express.Router();
const {
  getPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const { register, login, registerWithRole } = require("../controllers/authController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Rutas de paciente con permisos según el rol
router.get("/", authMiddleware, authorize(['doctor', 'admin']), getPatients);
router.post("/", authMiddleware, authorize(['admin']), createPatient);
router.get("/:id", authMiddleware, authorize(['doctor', 'admin', 'patient']), getPatient);
router.put("/:id", authMiddleware, authorize(['doctor', 'admin']), updatePatient);
router.delete("/:id", authMiddleware, authorize(['admin']), deletePatient);

module.exports = router;
