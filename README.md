# Sistema de Gestión de Reservas de Hotel (Backend)

Este proyecto es un backend para un sistema de gestión de reservas de hotel, desarrollado con Node.js, Express y Oracle Database.

## Requisitos previos

- Node.js (v14 o superior)
- Oracle Database (11g o superior)
- Oracle Instant Client

## Configuración

1. Clonar el repositorio:

   ```
   git clone <url-del-repositorio>
   cd sistema-de-gestion-de-reservas-hotel-back
   ```

2. Instalar dependencias:

   ```
   npm install
   ```

3. Configurar las variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_CONNECT_STRING=localhost:1521/XE
   ```

4. Crear las tablas en la base de datos:
   Ejecutar el script `database.sql` en Oracle SQL Developer o SQLPlus.

## Ejecución

Para iniciar el servidor en modo desarrollo:

```
npm run dev
```

Para iniciar el servidor en modo producción:

```
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## Endpoints API

- Hoteles: `/api/hoteles`
- Habitaciones: `/api/habitaciones`
- Usuarios: `/api/usuarios`
- Reservas: `/api/reservas`

Cada endpoint soporta operaciones CRUD (GET, POST, PUT, DELETE).

## Contribuir

Si deseas contribuir al proyecto, por favor crea un fork del repositorio y envía un pull request con tus cambios.

## Licencia

Este proyecto está bajo la Licencia MIT.
