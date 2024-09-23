const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// Crear una nueva habitación
router.post("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { hotel_id, tipo, capacidad, precio } = req.body;
    const result = await connection.execute(
      `INSERT INTO habitacion (hotel_id, tipo, capacidad, precio) 
       VALUES (:hotel_id, :tipo, :capacidad, :precio) 
       RETURNING habitacion_id INTO :id`,
      {
        hotel_id,
        tipo,
        capacidad,
        precio,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true }
    );
    res.status(201).json({ ...req.body, habitacion_id: result.outBinds.id[0] });
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

// Obtener todas las habitaciones
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute("SELECT * FROM habitacion", [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
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

// Obtener una habitación específica
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "SELECT * FROM habitacion WHERE habitacion_id = :id",
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habitación no encontrada" });
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

// Actualizar una habitación
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { hotel_id, tipo, capacidad, precio } = req.body;
    const result = await connection.execute(
      `UPDATE habitacion 
       SET hotel_id = :hotel_id, tipo = :tipo, capacidad = :capacidad, precio = :precio 
       WHERE habitacion_id = :id`,
      { hotel_id, tipo, capacidad, precio, id: req.params.id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    res.json({ ...req.body, habitacion_id: req.params.id });
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

// Eliminar una habitación
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "DELETE FROM habitacion WHERE habitacion_id = :id",
      [req.params.id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    res.json({ message: "Habitación eliminada exitosamente" });
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
