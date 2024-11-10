const Patient = require("../models/Patient");

exports.createPatient = async (req, res) => {
  const { name, age, gender, medicalHistory } = req.body;

  try {
    const patient = await Patient.create({ name, age, gender, medicalHistory });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: "Patient creation failed" });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch patients" });
  }
};

exports.getPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch patient" });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, medicalHistory } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      id,
      { name, age, gender, medicalHistory },
      { new: true }
    );
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: "Failed to update patient" });
  }
};

// Eliminar un paciente sin verificar citas
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Eliminar directamente el paciente
    const patient = await Patient.findByIdAndDelete(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }
    res.json({ message: "Paciente eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando el paciente" });
  }
};
