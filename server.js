require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a PostgreSQL (Railway)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Forzar uso de SSL
});



//Endpoint para ver la tabla alumnos
app.get('/alumnos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Alumno');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
});



// Endpoint para verificar el código
app.get('/verificar-codigo/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Alumno WHERE codigo = $1', [codigo]);
        if (result.rows.length > 0) {
            res.json({ existe: true, alumno: result.rows[0] });
        } else {
            res.json({ existe: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// Usar el puerto que asigna Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});




