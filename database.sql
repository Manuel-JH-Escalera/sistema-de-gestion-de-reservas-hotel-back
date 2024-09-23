CREATE TABLE hotel (
    hotel_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    direccion VARCHAR2(200) NOT NULL,
    categoria NUMBER NOT NULL
);

CREATE TABLE habitacion (
    habitacion_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hotel_id NUMBER REFERENCES hotel(hotel_id),
    tipo VARCHAR2(50) NOT NULL,
    capacidad NUMBER NOT NULL,
    precio NUMBER(10, 2) NOT NULL
);

CREATE TABLE usuario (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    apellido VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    tel VARCHAR2(20),
    telefono VARCHAR2(20),
    password VARCHAR2(100) NOT NULL
);

CREATE TABLE reserva (
    reserva_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    habitacion_id NUMBER REFERENCES habitacion(habitacion_id),
    user_id NUMBER REFERENCES usuario(user_id),
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    cantidad_personas NUMBER NOT NULL
);