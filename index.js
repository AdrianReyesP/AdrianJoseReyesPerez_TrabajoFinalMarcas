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

// --- ENDPOINTS DE BÚSQUEDAS Y FILTROS (RECURSO PRINCIPAL) ---

app.get('/aldeas', (req, res) => {
    // Empezamos con una copia de todas las aldeas
    let resultados = [...aldeas];

    // 1. Filtrar por texto: Búsqueda por Clan [Requisito 3.5.1]
    if (req.query.clan) {
        resultados = resultados.filter(a => 
            a.clan.toLowerCase().includes(req.query.clan.toLowerCase())
        );
    }

    // 2. Filtrar por rango numérico: nivelAyuntamiento [Requisito 3.5.2]
    if (req.query.minTH) {
        resultados = resultados.filter(a => a.nivelAyuntamiento >= parseInt(req.query.minTH));
    }
    if (req.query.maxTH) {
        resultados = resultados.filter(a => a.nivelAyuntamiento <= parseInt(req.query.maxTH));
    }

    // 3. Filtrar por condición booleana: escudoActivo [Requisito 3.5.5]
    if (req.query.escudo) {
        const tieneEscudo = req.query.escudo === 'true';
        resultados = resultados.filter(a => a.escudoActivo === tieneEscudo);
    }

    // 4. Ordenar por campo concreto y modo (asc/desc) [Requisito 3.5.4]
    if (req.query.ordenarPor) {
        const campo = req.query.ordenarPor;
        const modo = req.query.modo === 'desc' ? -1 : 1;
        
        resultados.sort((a, b) => {
            if (a[campo] < b[campo]) return -1 * modo;
            if (a[campo] > b[campo]) return 1 * modo;
            return 0;
        });
    }

    // Enviamos los resultados (filtrados o no) con código 200
    res.status(200).json(resultados);
});


// --- ENDPOINTS RECURSO SECUNDARIO (TROPAS) ---

// 1. Obtener todas las tropas [Requisito 3.2]

app.get('/tropas', (req, res) => {
    res.status(200).json(tropas); // [cite: 54]
});

// 2. Obtener todas las tropas de una aldea concreta [Requisito 3.2]
// Ejemplo: /aldeas/1/tropas

app.get('/aldeas/:id/tropas', (req, res) => {
    const aldeaId = parseInt(req.params.id);
    const tropasFiltradas = tropas.filter(t => t.aldea_id === aldeaId);
    
    if (tropasFiltradas.length > 0) {
        res.status(200).json(tropasFiltradas);
    } else {
        // Si no hay tropas o la aldea no existe [cite: 57]
        res.status(404).json({ mensaje: "No se encontraron tropas para esta aldea" });
    }
});

// 3. Crear una nueva tropa vinculada a una aldea [Requisito 3.3]

app.post('/tropas', (req, res) => {
    const { nombre, nivel, tipo, aldea_id } = req.body;

    // Validación de campos obligatorios [cite: 56]
    if (!nombre || !aldea_id) {
        return res.status(400).json({ mensaje: "Faltan datos: nombre y aldea_id son obligatorios" });
    }

    const nuevaTropa = {
        id: tropas.length + 1,
        nombre,
        nivel: nivel || 1,
        tipo: tipo || "Terrestre",
        aldea_id: parseInt(aldea_id)
    };

    tropas.push(nuevaTropa);
    res.status(201).json(nuevaTropa); // [cite: 55]
});

// 4. Eliminar una tropa [Requisito 3.4]

app.delete('/tropas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = tropas.findIndex(t => t.id === id);

    if (indice !== -1) {
        tropas.splice(indice, 1);
        res.status(200).json({ mensaje: "Tropa eliminada correctamente" });
    } else {
        res.status(404).json({ mensaje: "La tropa con ese ID no existe" });
    }
});

// --- ENDPOINTS DE ESTADÍSTICAS Y UTILIDADES ---

// 1. Obtener el total de registros de cada recurso [Requisito 3.46]

app.get('/stats/total', (req, res) => {
    res.status(200).json({
        total_aldeas: aldeas.length,
        total_tropas: tropas.length
    });
});

// 2. Calcular la media de nivel de ayuntamiento [Requisito 3.44]

app.get('/stats/media-th', (req, res) => {
    if (aldeas.length === 0) return res.status(200).json({ media: 0 });
    
    const suma = aldeas.reduce((acc, aldea) => acc + aldea.nivelAyuntamiento, 0);
    const media = suma / aldeas.length;
    
    res.status(200).json({ 
        mensaje: "Media de nivel de Ayuntamiento",
        valor: media.toFixed(2) 
    });
});

// 3. Obtener las N aldeas con más copas (puntosControl) [Requisito 3.45]
// Ejemplo: /stats/top?n=3

app.get('/stats/top', (req, res) => {
    const n = parseInt(req.query.n) || 1;
    const topAldeas = [...aldeas]
        .sort((a, b) => b.puntosControl - a.puntosControl)
        .slice(0, n);
    
    res.status(200).json(topAldeas);
});

// --- MANEJO DE ERRORES GLOBAL [Requisito 4] ---
// Este middleware captura cualquier error inesperado para evitar que el servidor rompa

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: "Error inesperado del servidor" }); // Código 500 
});
