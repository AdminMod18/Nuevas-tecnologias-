const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes desde esta URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors()); // Permitir solicitudes preflight para todas las rutas

app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => {
        console.log('Conexión a MongoDB establecida');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

// Importar rutas
const authRoutes = require('./routes/authRoutes');  // Rutas de autenticación
const doctorRoutes = require('./routes/doctorRoutes'); // Rutas de doctores
const patientRoutes = require('./routes/patientRoutes'); // Rutas de pacientes
const appointmentRoutes = require('./routes/appointmentRoutes'); // Rutas de citas
const reportRoutes = require('./routes/reportRoutes'); // Rutas estadísticas
const reportpdfRoutes = require('./routes/reportpdfRoutes'); // Rutas PDFS


// Usar las rutas
app.use('/auth', authRoutes); // Rutas de autenticación, incluyendo /register-with-role
app.use('/doctors', doctorRoutes); // Rutas de doctores
app.use('/patients', patientRoutes); // Rutas de pacientes
app.use('/appointments', appointmentRoutes); // Rutas de citas
app.use('/reports', reportRoutes); // Rutas estadísticas
app.use('/pdf', reportpdfRoutes); // Rutas para generar PDFs

// Ruta principal para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
