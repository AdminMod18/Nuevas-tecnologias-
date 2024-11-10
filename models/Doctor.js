const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
