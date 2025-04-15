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
    ssl: { rejectUnauthorized: false }  // Asegura que Render pueda conectar sin problemas
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


app.get('/investigaciones', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM Investigacion');
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Erro al obtener las investigaciones'})
    }
});


// GET /investigaciones/por-linea/:linea
app.get('/investigaciones/por-linea/:linea', async (req, res) => {
    const { linea } = req.params;

    try {
        const result = await pool.query(
            'SELECT sublinea_investigacion FROM Investigacion WHERE lineas_investigacion = $1',
            [linea]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al filtrar sublíneas' });
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


// Endpoint para buscar títulos similares
app.get('/buscar-titulos/:titulo', async (req, res) => {
    const { titulo } = req.params;
    try {
        const result = await pool.query(
            `SELECT titulo_investigacion 
             FROM Titulos 
             WHERE titulo_investigacion ILIKE '%' || $1 || '%'`, 
            [titulo]
        );
        
        res.json({ titulos_similares: result.rows });
    } catch (error) {
        console.error('Error al buscar títulos similares:', error);
        res.status(500).json({ error: 'Error al buscar títulos similares' });
    }
});



app.get('/cursos/sistemas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT curso, seccion FROM Cursos WHERE id_carrera = 1`  // 1 = Ingeniería de Sistemas
        );
        res.json(result.rows); // [{curso: 'Estructura de Datos'}, ...]
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los cursos de Sistemas' });
    }
});


// Usar el puerto que asigna Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});




