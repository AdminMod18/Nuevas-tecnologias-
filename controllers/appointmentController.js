const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Obtener todas las citas
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor patient");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cita con validaciones
exports.createAppointment = async (req, res) => {
  const { date, doctorId, patientId, notes } = req.body;

  if (!doctorId || !patientId) {
    return res.status(400).json({ error: "Doctor ID y Patient ID son requeridos." });
  }

  try {
    const appointmentDate = new Date(date);

    // Validación 1: Verificar citas dentro de un rango de 20 minutos para el mismo doctor
    const twentyMinutesEarlier = new Date(appointmentDate.getTime() - 20 * 60 * 1000); // 20 minutos antes
    const twentyMinutesLater = new Date(appointmentDate.getTime() + 20 * 60 * 1000);  // 20 minutos después

    const overlappingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: { $gte: twentyMinutesEarlier, $lt: twentyMinutesLater }
    });

    if (overlappingAppointment) {
      return res.status(400).json({ error: "No se puede programar una cita en el mismo horario o dentro de los próximos 20 minutos para este doctor." });
    }

    // Validación 2: Verificar si el paciente ya tiene una cita con el mismo doctor el mismo día
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0); // Inicio del día
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999); // Fin del día

    const sameDayAppointment = await Appointment.findOne({
      doctor: doctorId,
      patient: patientId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (sameDayAppointment) {
      return res.status(400).json({ error: "No puedes tener más de una cita con el mismo doctor el mismo día." });
    }

    // Crear la cita si pasa ambas validaciones
    const newAppointment = new Appointment({ patient: patientId, doctor: doctorId, date: appointmentDate, notes });
    await newAppointment.save();

    // Actualizar doctor y paciente para agregar la cita
    await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: newAppointment._id } });
    await Patient.findByIdAndUpdate(patientId, { $push: { appointments: newAppointment._id } });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creando la cita:', error);
    res.status(500).json({ error: 'Error creando la cita' });
  }
};

// Obtener una cita por ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctor patient");
    if (!appointment) return res.status(404).json({ error: "Cita no encontrada" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cita
exports.updateAppointment = async (req, res) => {
  const { date, doctorId, patientId, notes } = req.body;

  try {
    const currentAppointment = await Appointment.findById(req.params.id);
    if (!currentAppointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    // Actualizar las referencias solo si el doctor o el paciente cambian y están definidos
    if (doctorId && (!currentAppointment.doctor || doctorId !== currentAppointment.doctor.toString())) {
      if (currentAppointment.doctor) {
        await Doctor.findByIdAndUpdate(currentAppointment.doctor, { $pull: { appointments: currentAppointment._id } });
      }
      await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: currentAppointment._id } });
    }

    if (patientId && (!currentAppointment.patient || patientId !== currentAppointment.patient.toString())) {
      if (currentAppointment.patient) {
        await Patient.findByIdAndUpdate(currentAppointment.patient, { $pull: { appointments: currentAppointment._id } });
      }
      await Patient.findByIdAndUpdate(patientId, { $push: { appointments: currentAppointment._id } });
    }

    // Actualizar la cita con los datos proporcionados, incluyendo `notes`
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId, patient: patientId, date, notes },
      { new: true }
    ).populate("doctor patient");

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error actualizando la cita:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una cita
exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    // Eliminar la referencia de la cita en Doctor y Patient
    await Doctor.findByIdAndUpdate(deletedAppointment.doctor, { $pull: { appointments: deletedAppointment._id } });
    await Patient.findByIdAndUpdate(deletedAppointment.patient, { $pull: { appointments: deletedAppointment._id } });

    res.json({ message: "Cita eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentsForUser = async (req, res) => {
  try {
      const { userId, role } = req.user; // Extraer userId y role del token

      if (role === 'patient') {
          // Obtener citas relacionadas con el ID del paciente logueado
          const appointments = await Appointment.find({ patient: userId })
              .populate('doctor', 'name') // Obtener el nombre del doctor
              .populate('patient', 'name'); // Obtener el nombre del paciente

          return res.status(200).json(appointments);
      }

      return res.status(403).json({ error: "Access denied. Only patients can view their appointments." });
  } catch (error) {
      console.error("Error fetching appointments for user:", error);
      res.status(500).json({ error: "Error fetching appointments." });
  }
};
