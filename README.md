# ⚔️ API REST Clash of Clans - Trabajo Final LMSGI

**Alumno:**  Adrian Jose Reyes Perez
**Curso:** 1º DAM - Lenguajes de Marcas y Sistemas de la Información  

##  Descripción
[cite_start]Este proyecto consiste en el diseño e implementación de una API REST completa utilizando **Node.js** y **Express**[cite: 4, 5]. La temática elegida es el popular juego **Clash of Clans**, gestionando información sobre las aldeas de los jugadores y sus tropas asociadas.

##  Tecnologías Utilizadas
* **Node.js**: Entorno de ejecución para JavaScript.
* **Express**: Framework para la creación del servidor y gestión de rutas.
* **Bruno**: Herramienta para testeo de endpoints y gestión de colecciones.
* [cite_start]**Git/GitHub**: Control de versiones con historial progresivo[cite: 83, 86].

---

##  Estructura de Datos
[cite_start]La API gestiona dos recursos relacionados mediante un campo `id`[cite: 6, 7]:

1. [cite_start]**Recurso Principal (Aldeas):** Contiene 8 campos obligatorios (id, nombre, nivelAyuntamiento, puntosControl, constructoras, escudoActivo, clan, nivelMuros)[cite: 14].
2. [cite_start]**Recurso Secundario (Tropas):** Relacionado con el principal mediante el campo `aldea_id`[cite: 15].

---

## Endpoints y Rutas

###  Gestión de Aldeas (Principal)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **GET** | `/aldeas` | Obtiene todos los registros y permite **filtros/ordenación**. |
| **GET** | `/aldeas/:id` | [cite_start]Obtiene una aldea específica por su ID (Route Params)[cite: 26]. |
| **GET** | `/buscar-aldea` | [cite_start]Busca una aldea por nombre exacto (Query Params)[cite: 26]. |
| **POST** | `/aldeas` | [cite_start]Crea una nueva aldea con validación de campos[cite: 27]. |

###  Gestión de Tropas (Secundario)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **GET** | `/tropas` | Obtiene todas las tropas registradas. |
| **GET** | `/aldeas/:id/tropas` | [cite_start]Obtiene las tropas pertenecientes a una aldea concreta[cite: 32]. |
| **POST** | `/tropas` | [cite_start]Crea una nueva tropa vinculada a una aldea[cite: 33]. |
| **DELETE** | `/tropas/:id` | [cite_start]Elimina una tropa del sistema[cite: 34]. |

---

##  Búsquedas y Filtros Avanzados (Commit 4)
[cite_start]Se han implementado los siguientes mecanismos de filtrado mediante Query Params[cite: 36, 39]:
* **Texto parcial:** Filtrar aldeas por nombre de clan (`?clan=nombre`).
* **Rango Numérico:** Filtrar por nivel de Ayuntamiento (`?minTH=X&maxTH=Y`).
* **Estado Booleano:** Filtrar por escudo activo (`?escudo=true/false`).
* **Ordenación:** Ordenar resultados por puntos de control (`?ordenarPor=puntosControl&modo=desc`).

---

##  Manejo de Errores
[cite_start]La API gestiona los siguientes códigos de estado HTTP de forma coherente[cite: 53]:
* **200 OK**: Respuesta exitosa.
* **201 Created**: Recurso creado con éxito.
* **400 Bad Request**: Datos enviados incorrectos o incompletos.
* **404 Not Found**: El recurso solicitado no existe.
* **500 Internal Error**: Error inesperado del servidor.

---

##  Instrucciones de Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar las dependencias (Express).
3. Iniciar el servidor con `node index.js`.
4. Importar la colección de Bruno incluida en la carpeta raíz para realizar las pruebas.