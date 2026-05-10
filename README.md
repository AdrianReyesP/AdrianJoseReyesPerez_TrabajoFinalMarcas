# Trabajo Final: API REST Clash of Clans ⚔️

Alumno: Adrian Jose Reyes Perez
Asignatura: Lenguajes de Marcas y Sistemas de la Información (1º DAM)

Descripción de la temática
Esta API permite gestionar una base de datos de **Clash of Clans**. El recurso principal son las **Aldeas** (Villages), que contienen información técnica sobre el progreso del jugador. El recurso secundario son las **Tropas**, las cuales están vinculadas a una aldea específica mediante su ID.



Recursos y Endpoints

Recurso Principal: Aldeas
Cada registro de aldea cuenta con 8 campos: `id`, `nombre`, `nivelAyuntamiento`, `puntosControl`, `constructoras`, `escudoActivo`, `clan` y `nivelMuros`.

Recurso Secundario: Tropas

Gestión de Errores (Códigos HTTP)

La API implementa los siguientes códigos según los requisitos:
* **200 OK**: Petición exitosa.
* **201 Created**: Recurso creado correctamente.
* **400 Bad Request**: Datos incorrectos o incompletos.
* **404 Not Found**: El recurso solicitado no existe.
* **500 Internal Server Error**: Error inesperado del servidor.
