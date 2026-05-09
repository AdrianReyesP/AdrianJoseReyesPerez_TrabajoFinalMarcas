const express = require('express');
const app = express();
const PORT = 2505; 

// Middleware para procesar JSON
app.use(express.json());


// --- DATOS INICIALES ---

// Recurso Principal: Aldeas (8 campos obligatorios) [cite: 14]
let aldeas = [
    { 
        id: 1, 
        nombre: "La Fortaleza", 
        nivelAyuntamiento: 11, 
        Copas: 2500, 
        constructoras: 5, 
        escudoActivo: true, 
        clan: "Los Valientes", 
        nivelMuros: 10 
    },
    { 
        id: 2, 
        nombre: "Aldea Nocturna", 
        nivelAyuntamiento: 9, 
        Copas: 1800, 
        constructoras: 3, 
        escudoActivo: false, 
        clan: "Furia Roja", 
        nivelMuros: 8 
    }
];

// Recurso Secundario: Tropas (vinculado por aldea_id) [cite: 7, 15]
let tropas = [
    { id: 1, nombre: "Bárbaro", nivel: 7, tipo: "Terrestre", aldea_id: 1 },
    { id: 2, nombre: "Arquera", nivel: 6, tipo: "Terrestre", aldea_id: 1 },
    { id: 3, nombre: "Dragón", nivel: 4, tipo: "Aéreo", aldea_id: 2 }
];

// --- RUTAS DE PRUEBA ---

app.get('/', (req, res) => {
    res.send('API de Clash of Clans funcionando ⚔️');
});

// Arrancar el servidor con mensaje de confirmación [cite: 12]
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// --- ENDPOINTS RECURSO PRINCIPAL (ALDEAS) ---

// 1. Obtener todas las aldeas

app.get('/aldeas', (req, res) => {
    res.status(200).json(aldeas); // Código 200 OK [cite: 54]
});

// 2. Obtener una aldea por ID (Forma 1: Route Params)

app.get('/aldeas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const aldea = aldeas.find(a => a.id === id);

    if (aldea) {
        res.status(200).json(aldea);
    } else {
        res.status(404).json({ mensaje: "Aldea no encontrada" }); // Código 404 [cite: 57]
    }
});

// 3. Obtener una aldea por Nombre (Forma 2: Query Params)
// Ejemplo: /buscar-aldea?nombre=La Fortaleza

app.get('/buscar-aldea', (req, res) => {
    const nombre = req.query.nombre;
    const aldea = aldeas.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    if (aldea) {
        res.status(200).json(aldea);
    } else {
        res.status(404).json({ mensaje: "No se encontró una aldea con ese nombre" });
    }
});

// 4. Crear una nueva aldea (con validación de campos obligatorios)

app.post('/aldeas', (req, res) => {
    const { nombre, nivelAyuntamiento, puntosControl, constructoras, escudoActivo, clan, nivelMuros } = req.body;

    // Validación básica [cite: 27, 56, 59]

    if (!nombre || !nivelAyuntamiento) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios (nombre y nivelAyuntamiento)" });
    }

    const nuevaAldea = {
        id: aldeas.length + 1,
        nombre,
        nivelAyuntamiento,
        puntosControl: puntosControl || 0,
        constructoras: constructoras || 2,
        escudoActivo: escudoActivo || false,
        clan: clan || "Sin Clan",
        nivelMuros: nivelMuros || 1
    };

    aldeas.push(nuevaAldea);
    res.status(201).json(nuevaAldea); // Código 201 Created [cite: 55]
});
