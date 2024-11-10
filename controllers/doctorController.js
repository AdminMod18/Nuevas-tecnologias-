const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Obtener todos los doctores
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo doctor
exports.createDoctor = async (req, res) => {
  const { name, specialization, email, phone } = req.body;

  try {
    const newDoctor = new Doctor({ name, specialization, email, phone });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un doctor por ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un doctor
exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDoctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Verifica si hay citas relacionadas con el doctor
    const appointments = await Appointment.find({ doctor: doctorId });
    if (appointments.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el doctor porque tiene citas asociadas.' });
    }

    // Si no hay citas, procede a eliminar el doctor
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor no encontrado." });
    }

    res.json({ message: 'Doctor eliminado exitosamente.' });
  } catch (error) {
    console.error('Error eliminando el doctor:', error);
    res.status(500).json({ error: 'Error eliminando el doctor.' });
  }
};
