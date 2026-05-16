const express = require('express'), app = express();

// Información de base de datos 
const alumnos = [{ id: 1, nombre: 'Caleb Gutiérrez' }, { id: 2, nombre: 'Alejandra Carrillo' }];

// Habilitar el servicio de archivos estáticos y el análisis de peticiones JSON
app.use(express.static('public')), app.use(express.json());

// Ruta de la API para obtener el listado de alumnos de referencia
app.get('/api/alumnos', (req, res) => res.json(alumnos));

// Inicialización del servidor en el puerto 3000
app.listen(3000, () => console.log('Servidor ejecutándose en el puerto 3000'));