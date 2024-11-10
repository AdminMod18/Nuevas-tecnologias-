const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
