const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Appointment = require('../models/Appointment');

exports.generateReport = async (req, res) => {
    const dir = './reports';
    const filename = 'report_latest.pdf';
    const filePath = path.join(dir, filename);

    // Asegúrate de que la carpeta de reportes exista
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // Verifica si el reporte ya existe
    if (fs.existsSync(filePath)) {
        // Si el reporte ya existe, devuélvelo directamente sin generarlo de nuevo
        return res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error al descargar el archivo existente:', err);
                res.status(500).send('Error al descargar el archivo existente.');
            }
        });
    }

    // Crea un nuevo documento PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath)); // Guarda el PDF en el sistema de archivos

    doc.fontSize(25).text('Informe de Citas', { align: 'center' });
    doc.moveDown();

    try {
        const appointments = await Appointment.find().populate('doctor patient');
        
        appointments.forEach(appointment => {
            doc.fontSize(12).text(`Cita ID: ${appointment._id}`);

            if (appointment.patient) {
                doc.text(`Paciente: ${appointment.patient.name}`);
            } else {
                doc.text('Paciente: Desconocido');
            }

            if (appointment.doctor) {
                doc.text(`Doctor: ${appointment.doctor.name}`);
            } else {
                doc.text('Doctor: Desconocido');
            }

            doc.text(`Fecha: ${new Date(appointment.date).toLocaleString()}`);
            doc.text('----------------------------------');
        });

        doc.end();

        doc.on('finish', () => {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Error al descargar el archivo.');
                }
            });
        });
    } catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).json({ error: 'Error generando el PDF' });
    }
};
