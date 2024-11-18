const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForUser,
} = require("../controllers/appointmentController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Rutas de cita con permisos según el rol
router.get('/patient', authMiddleware, authorize(['admin','patient']),getAppointmentsForUser);
router.get("/", authMiddleware, authorize(['doctor', 'admin','patient']), getAppointments);
router.post("/", authMiddleware, authorize(['admin','doctor','patient']), createAppointment);
router.get("/:id", authMiddleware, authorize(['doctor', 'admin', 'patient']), getAppointmentById);
router.put("/:id", authMiddleware, authorize(['doctor', 'admin']), updateAppointment);
router.delete("/:id", authMiddleware, authorize(['admin']), deleteAppointment);

module.exports = router;
