const express = require('express');
const app = express();
const PORT = 2505;

// Middleware para procesar JSON
app.use(express.json());

// --- DATOS INICIALES ---

let aldeas = [
    { id: 1,
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

let tropas = [
    { id: 1, nombre: "Bárbaro", nivel: 7, tipo: "Terrestre", aldea_id: 1 },
    { id: 2, nombre: "Arquera", nivel: 6, tipo: "Terrestre", aldea_id: 1 },
    { id: 3, nombre: "Dragón", nivel: 4, tipo: "Aéreo", aldea_id: 2 }
];

// --- RUTAS DE PRUEBA ---

app.get('/', (req, res) => {
    res.send('API de Clash of Clans funcionando ');
});

// --- ENDPOINTS RECURSO PRINCIPAL (ALDEAS) ---

// 1. Obtener todas las aldeas + Filtros [Requisito 3.5]

app.get('/aldeas', (req, res) => {
    let resultados = [...aldeas];

    // Filtro por Clan

    if (req.query.clan) {
        resultados = resultados.filter(a => 
            a.clan.toLowerCase().includes(req.query.clan.toLowerCase())
        );
    }

    // Filtro por Ayuntamiento (Rango)

    if (req.query.minTH) {
        resultados = resultados.filter(a => a.nivelAyuntamiento >= parseInt(req.query.minTH));
    }
    if (req.query.maxTH) {
        resultados = resultados.filter(a => a.nivelAyuntamiento <= parseInt(req.query.maxTH));
    }

    // Filtro por Escudo (Booleano)

    if (req.query.escudo) {
        const tieneEscudo = req.query.escudo === 'true';
        resultados = resultados.filter(a => a.escudoActivo === tieneEscudo);
    }

    // Ordenación

    if (req.query.ordenarPor) {
        const campo = req.query.ordenarPor;
        const modo = req.query.modo === 'desc' ? -1 : 1;
        resultados.sort((a, b) => (a[campo] > b[campo] ? 1 : -1) * modo);
    }

    res.status(200).json(resultados);
});

// 2. Buscar aldea por NOMBRE exacto [Requisito 3.5.1]

app.get('/buscar-aldea', (req, res) => {
    const nombreBusqueda = req.query.nombre;
    if (!nombreBusqueda) return res.status(400).json({ mensaje: "Falta el nombre" });

    const aldea = aldeas.find(a => a.nombre.toLowerCase() === nombreBusqueda.toLowerCase());
    if (aldea) res.status(200).json(aldea);
    else res.status(404).json({ mensaje: "Aldea no encontrada" });
});

// 3. Obtener aldea por ID [Requisito 3.2]

app.get('/aldeas/:id', (req, res) => {
    const aldea = aldeas.find(a => a.id === parseInt(req.params.id));
    if (aldea) res.status(200).json(aldea);
    else res.status(404).json({ mensaje: "ID no encontrado" });
});

// 4. Crear nueva aldea [Requisito 3.3]

app.post('/aldeas', (req, res) => {
    const { nombre, nivelAyuntamiento } = req.body;
    if (!nombre || !nivelAyuntamiento) {
        return res.status(400).json({ mensaje: "Faltan datos: nombre y nivelAyuntamiento son obligatorios" });
    }
    const nuevaAldea = { id: aldeas.length + 1, ...req.body };
    aldeas.push(nuevaAldea);
    res.status(201).json(nuevaAldea);
});

// --- ENDPOINTS RECURSO SECUNDARIO (TROPAS) ---

app.get('/tropas', (req, res) => {
    res.status(200).json(tropas);
});

app.get('/aldeas/:id/tropas', (req, res) => {
    const aldeaId = parseInt(req.params.id);
    const filtradas = tropas.filter(t => t.aldea_id === aldeaId);
    if (filtradas.length > 0) res.status(200).json(filtradas);
    else res.status(404).json({ mensaje: "No hay tropas para esta aldea" });
});

app.post('/tropas', (req, res) => {
    const { nombre, aldea_id } = req.body;
    if (!nombre || !aldea_id) return res.status(400).json({ mensaje: "Faltan datos" });
    const nueva = { id: tropas.length + 1, ...req.body };
    tropas.push(nueva);
    res.status(201).json(nueva);
});

app.delete('/tropas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = tropas.findIndex(t => t.id === id);
    if (indice !== -1) {
        tropas.splice(indice, 1);
        res.status(200).json({ mensaje: "Tropa eliminada" });
    } else {
        res.status(404).json({ mensaje: "ID no existe" });
    }
});

// --- ESTADÍSTICAS ---

app.get('/stats/total', (req, res) => {
    res.status(200).json({ total_aldeas: aldeas.length, total_tropas: tropas.length });
});

app.get('/stats/media-th', (req, res) => {
    if (aldeas.length === 0) return res.status(200).json({ media: 0 });
    const suma = aldeas.reduce((acc, a) => acc + a.nivelAyuntamiento, 0);
    res.status(200).json({ media: (suma / aldeas.length).toFixed(2) });
});


// 3. Obtener las N aldeas con más copas [Requisito 3.4.5]

app.get('/stats/top', (req, res) => {
    const n = parseInt(req.query.n) || 1;
    
    
    const topAldeas = [...aldeas]
        .sort((a, b) => b.Copas - a.Copas)
        .slice(0, n);

    res.status(200).json(topAldeas);
});

// --- MANEJO DE ERRORES Y ARRANQUE ---

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: "Error inesperado del servidor" });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
