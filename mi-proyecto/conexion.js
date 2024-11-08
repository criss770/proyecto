const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;

// Configuración de conexión
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'Proyecto'
});

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Ruta para registrar estudiante
app.post('/registrar', (req, res) => {
    const { cedula, nombre, apellidos, direccion, ubicacion } = req.body;

    const query = `INSERT INTO Estudiantes (cedula, nombre, apellidos, direccion, ubicacion) VALUES (?, ?, ?, ?, ?)`;
    conexion.query(query, [cedula, nombre, apellidos, direccion, ubicacion], (err) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al insertar datos');
        } else {
            res.send('Estudiante registrado exitosamente');
        }
    });
});

// Ruta para consultar estudiantes por distancia
app.get('/estudiantes/distancia', (req, res) => {
    const query = `
        SELECT *, 
            ST_Distance_Sphere(
                point(ubicacion_longitud, ubicacion_latitud), 
                point(trabajo_longitud, trabajo_latitud)
            ) AS distancia
        FROM Estudiantes
        ORDER BY distancia ASC;
    `;

    conexion.query(query, (err, results) => {
        if (err) {
            console.error('Error al consultar distancia:', err);
            res.status(500).send('Error al consultar distancia');
        } else {
            res.json(results);
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Función para registrar estudiante desde el navegador
function registrarEstudiante() {
    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const direccion = document.getElementById('direccion').value;
    const ubicacion = document.getElementById('ubicacion').value;

    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula, nombre, apellidos, direccion, ubicacion })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
