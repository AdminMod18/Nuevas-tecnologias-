const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
