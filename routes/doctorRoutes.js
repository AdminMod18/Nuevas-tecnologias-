const express = require("express");
const router = express.Router();
const {
  getDoctors,
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Rutas de doctor con permisos según el rol
router.get("/", authMiddleware, authorize(['doctor', 'admin']), getDoctors);
router.post("/", authMiddleware, authorize(['admin']), createDoctor);
router.get("/:id", authMiddleware, authorize(['doctor', 'admin']), getDoctorById);
router.put("/:id", authMiddleware, authorize(['doctor', 'admin']), updateDoctor);
router.delete("/:id", authMiddleware, authorize(['admin']), deleteDoctor);

module.exports = router;
