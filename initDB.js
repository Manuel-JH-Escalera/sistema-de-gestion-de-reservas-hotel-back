const oracledb = require("oracledb");
require("dotenv").config();

async function initDB() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });

    console.log("Conectado a la base de datos Oracle");

    // Crear tabla HOTEL
    await connection.execute(`
      CREATE TABLE hotel (
        hotel_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nombre VARCHAR2(100) NOT NULL,
        direccion VARCHAR2(200) NOT NULL,
        categoria NUMBER NOT NULL
      )
    `);

    // Crear tabla HABITACION
    await connection.execute(`
      CREATE TABLE habitacion (
        habitacion_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        hotel_id NUMBER REFERENCES hotel(hotel_id),
        tipo VARCHAR2(50) NOT NULL,
        capacidad NUMBER NOT NULL,
        precio NUMBER(10, 2) NOT NULL
      )
    `);

    // Crear tabla USUARIO
    await connection.execute(`
      CREATE TABLE usuario (
        user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nombre VARCHAR2(50) NOT NULL,
        apellido VARCHAR2(50) NOT NULL,
        email VARCHAR2(100) UNIQUE NOT NULL,
        tel VARCHAR2(20),
        telefono VARCHAR2(20),
        password VARCHAR2(100) NOT NULL
      )
    `);

    // Crear tabla RESERVA
    await connection.execute(`
      CREATE TABLE reserva (
        reserva_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        habitacion_id NUMBER REFERENCES habitacion(habitacion_id),
        user_id NUMBER REFERENCES usuario(user_id),
        fecha_entrada DATE NOT NULL,
        fecha_salida DATE NOT NULL,
        cantidad_personas NUMBER NOT NULL
      )
    `);

    console.log("Tablas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Conexión cerrada");
      } catch (error) {
        console.error("Error al cerrar la conexión:", error);
      }
    }
  }
}

initDB();
