const express = require('express');
const app = express();
const PORT = 2505;

// Middleware para procesar JSON, de esta forma al usar bruno entiende el código, digamos que es un traductor.

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


// 3. Crear una nueva aldea [Requisito 3.3] - Validación Estricta //Cambio: antes podiamos crear una nueva base exceptuando algun cambio, ahora ya no, cogemos todos los campos utilizados
//y los validamos para que sean obligatorios, luego de la validación se crea la base.

app.post('/aldeas', (req, res) => {

    // Extraemos todos los campos necesarios del cuerpo de la petición

    const { 
        nombre, 
        nivelAyuntamiento, 
        Copas, 
        constructoras, 
        escudoActivo, 
        clan, 
        nivelMuros 
    } = req.body;

    // Validación de TODOS los campos obligatorios
    // Usamos !== undefined para los campos que pueden ser 0 o false

    if (
        !nombre || 
        !nivelAyuntamiento || 
        Copas === undefined || 
        !constructoras || 
        escudoActivo === undefined || 
        !clan || 
        !nivelMuros
    ) {

        return res.status(400).json({ 
            mensaje: "Error: Faltan datos obligatorios. La aldea debe tener: nombre, nivelAyuntamiento, Copas, constructoras, escudoActivo, clan y nivelMuros" 

        });
    }

    // Si pasa la validación, construimos el objeto
    const nuevaAldea = {
        id: aldeas.length + 1,
        nombre,
        nivelAyuntamiento,
        Copas,
        constructoras,
        escudoActivo,
        clan,
        nivelMuros
    };

    aldeas.push(nuevaAldea);
    res.status(201).json(nuevaAldea); // 201 significa "Recurso creado"
});


// --- ENDPOINTS RECURSO SECUNDARIO (TROPAS) ---

app.get('/tropas', (req, res) => {
    res.status(200).json(tropas);
});

// Aqui vemos las tropas que tiene cada aldea, la podemos ver usando el id de la base, mostrándonos todas las tropas que tiene la aldea

app.get('/aldeas/:id/tropas', (req, res) => {
    const aldeaId = parseInt(req.params.id);
    const filtradas = tropas.filter(t => t.aldea_id === aldeaId);
    if (filtradas.length > 0) res.status(200).json(filtradas);
    else res.status(404).json({ mensaje: "No hay tropas para esta aldea" });
});


// 3. Crear una nueva tropa con requisitos estrictos de forma que no podamos crear la tropa si no tenemos todos los campos necesarios

app.post('/tropas', (req, res) => {

    // Extraigo los campos necesarios

    const { nombre, nivel, tipo, aldea_id } = req.body;

    // VALIDACIÓN: No deja crear si falta NOMBRE, NIVEL, TIPO o ALDEA_ID

    if (!nombre || nivel === undefined || !tipo || !aldea_id) {
        return res.status(400).json({ 
            mensaje: "Error: Datos incompletos. Se requiere: nombre, nivel, tipo y aldea_id" 
        });
    }

    // Creamos el objeto nuevo

    const nuevaTropa = {
        id: tropas.length + 1, // Generación automática del ID
        nombre: nombre,
        nivel: nivel,
        tipo: tipo,
        aldea_id: parseInt(aldea_id)
    };

    // Respuesta de éxito
    res.status(201).json(nuevaTropa);
});


// Eliminamos cualquier tropa mediante el id de la misma

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

// Vemos el numero de aldeas y tropas que tenemos creadas 

app.get('/stats/total', (req, res) => {
    res.status(200).json({ total_aldeas: aldeas.length, total_tropas: tropas.length });
});

//Aqui calculamos la media que hacen la suma de todos los ayuntamientos de todas las cuentas.

app.get('/stats/media-th', (req, res) => {
    if (aldeas.length === 0) return res.status(200).json({ media: 0 });
    const suma = aldeas.reduce((acc, a) => acc + a.nivelAyuntamiento, 0);
    res.status(200).json({ media: (suma / aldeas.length).toFixed(2) });
});


// Obtenemos una lista con las aldeas de mayor a menor numero de copas 

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
