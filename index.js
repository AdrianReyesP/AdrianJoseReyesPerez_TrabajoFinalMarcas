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
