const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// Crear una nueva reserva
router.post("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const {
      habitacion_id,
      user_id,
      fecha_entrada,
      fecha_salida,
      cantidad_personas,
    } = req.body;
    const result = await connection.execute(
      `INSERT INTO reserva (habitacion_id, user_id, fecha_entrada, fecha_salida, cantidad_personas) 
       VALUES (:habitacion_id, :user_id, TO_DATE(:fecha_entrada, 'YYYY-MM-DD'), TO_DATE(:fecha_salida, 'YYYY-MM-DD'), :cantidad_personas) 
       RETURNING reserva_id INTO :id`,
      {
        habitacion_id,
        user_id,
        fecha_entrada,
        fecha_salida,
        cantidad_personas,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true }
    );
    res.status(201).json({ ...req.body, reserva_id: result.outBinds.id[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Obtener todas las reservas
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT reserva_id, habitacion_id, user_id, 
              TO_CHAR(fecha_entrada, 'YYYY-MM-DD') as fecha_entrada, 
              TO_CHAR(fecha_salida, 'YYYY-MM-DD') as fecha_salida, 
              cantidad_personas 
       FROM reserva`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Obtener una reserva específica
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT reserva_id, habitacion_id, user_id, 
              TO_CHAR(fecha_entrada, 'YYYY-MM-DD') as fecha_entrada, 
              TO_CHAR(fecha_salida, 'YYYY-MM-DD') as fecha_salida, 
              cantidad_personas 
       FROM reserva 
       WHERE reserva_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Actualizar una reserva
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const {
      habitacion_id,
      user_id,
      fecha_entrada,
      fecha_salida,
      cantidad_personas,
    } = req.body;
    const result = await connection.execute(
      `UPDATE reserva 
         SET habitacion_id = :habitacion_id, user_id = :user_id, 
             fecha_entrada = TO_DATE(:fecha_entrada, 'YYYY-MM-DD'), 
             fecha_salida = TO_DATE(:fecha_salida, 'YYYY-MM-DD'), 
             cantidad_personas = :cantidad_personas 
         WHERE reserva_id = :id`,
      {
        habitacion_id,
        user_id,
        fecha_entrada,
        fecha_salida,
        cantidad_personas,
        id: req.params.id,
      },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json({ ...req.body, reserva_id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Eliminar una reserva
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "DELETE FROM reserva WHERE reserva_id = :id",
      [req.params.id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json({ message: "Reserva eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

module.exports = router;
