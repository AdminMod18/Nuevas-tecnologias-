const PDFDocument = require('pdfkit');
const fs = require('fs');
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.getStatistics = async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();

        // Agregar nombres de pacientes
        const appointmentsByPatient = await Appointment.aggregate([
            {
                $group: {
                    _id: "$patient", // Agrupar por ID del paciente
                    count: { $sum: 1 } // Contar el número de citas
                }
            },
            {
                $lookup: {
                    from: "patients", // Nombre de la colección de pacientes
                    localField: "_id", // ID del paciente en la colección de citas
                    foreignField: "_id", // ID del paciente en la colección de pacientes
                    as: "patientDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    patientName: { $arrayElemAt: ["$patientDetails.name", 0] } // Extraer el nombre del paciente
                }
            }
        ]);

        // Agregar nombres de doctores
        const appointmentsByDoctor = await Appointment.aggregate([
            {
                $group: {
                    _id: "$doctor", // Agrupar por ID del doctor
                    count: { $sum: 1 } // Contar el número de citas
                }
            },
            {
                $lookup: {
                    from: "doctors", // Nombre de la colección de doctores
                    localField: "_id", // ID del doctor en la colección de citas
                    foreignField: "_id", // ID del doctor en la colección de doctores
                    as: "doctorDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    doctorName: { $arrayElemAt: ["$doctorDetails.name", 0] } // Extraer el nombre del doctor
                }
            }
        ]);

        res.status(200).json({
            totalPatients,
            totalDoctors,
            totalAppointments,
            appointmentsByPatient,
            appointmentsByDoctor, // Incluir datos de citas por doctor
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Error fetching statistics" });
    }
};
