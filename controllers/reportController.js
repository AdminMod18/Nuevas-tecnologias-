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
        const appointmentsByDoctor = await Appointment.aggregate([
            { $group: { _id: "$doctor", count: { $sum: 1 } } }
        ]);
        const appointmentsByPatient = await Appointment.aggregate([
            { $group: { _id: "$patient", count: { $sum: 1 } } }
        ]);

        // Generación de PDF
        const doc = new PDFDocument();
        const filename = `report_statistics_${Date.now()}.pdf`;
        const filePath = `./reports/${filename}`;

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(25).text('Informe de Estadísticas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Total de Pacientes: ${totalPatients}`);
        doc.text(`Total de Doctores: ${totalDoctors}`);
        doc.text(`Total de Citas: ${totalAppointments}`);
        doc.moveDown();
        doc.text('Citas por Doctor:');
        appointmentsByDoctor.forEach(appointment => {
            doc.text(`Doctor ID: ${appointment._id}, Total Citas: ${appointment.count}`);
        });
        doc.moveDown();
        doc.text('Citas por Paciente:');
        appointmentsByPatient.forEach(appointment => {
            doc.text(`Paciente ID: ${appointment._id}, Total Citas: ${appointment.count}`);
        });

        doc.end();

        res.json({
            totalPatients,
            totalDoctors,
            totalAppointments,
            appointmentsByDoctor,
            appointmentsByPatient,
            pdf: filename // Puedes devolver el nombre del archivo PDF si deseas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
