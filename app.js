const express = require("express");
const oracledb = require("oracledb");
require("dotenv").config();

const hotelRoutes = require("./routes/hotel");
const habitacionRoutes = require("./routes/habitacion");
const usuarioRoutes = require("./routes/usuario");
const reservaRoutes = require("./routes/reserva");

const app = express();
app.use(express.json());

async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    console.log("Connection pool created");
  } catch (err) {
    console.error("Error creating connection pool:", err);
    process.exit(1);
  }
}

initialize();

app.use("/api/hoteles", hotelRoutes);
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/reservas", reservaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

process.on("SIGINT", () => {
  oracledb
    .getPool()
    .close(10)
    .then(() => {
      console.log("Pool closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing pool:", err);
      process.exit(1);
    });
});

module.exports = { app };
