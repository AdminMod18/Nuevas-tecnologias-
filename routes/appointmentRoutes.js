const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Rutas de cita con permisos según el rol
router.get("/", authMiddleware, authorize(['doctor', 'admin']), getAppointments);
router.post("/", authMiddleware, authorize(['admin','patient']), createAppointment);
router.get("/:id", authMiddleware, authorize(['doctor', 'admin', 'patient']), getAppointmentById);
router.put("/:id", authMiddleware, authorize(['doctor', 'admin']), updateAppointment);
router.delete("/:id", authMiddleware, authorize(['admin']), deleteAppointment);

module.exports = router;
