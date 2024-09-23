const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// Crear un nuevo hotel
router.post("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { nombre, direccion, categoria } = req.body;
    const result = await connection.execute(
      `INSERT INTO hotel (nombre, direccion, categoria) 
       VALUES (:nombre, :direccion, :categoria) 
       RETURNING hotel_id INTO :id`,
      {
        nombre,
        direccion,
        categoria,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true }
    );
    res.status(201).json({ ...req.body, hotel_id: result.outBinds.id[0] });
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

// Obtener todos los hoteles
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute("SELECT * FROM hotel", [], {
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

// Obtener un hotel específico
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "SELECT * FROM hotel WHERE hotel_id = :id",
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hotel no encontrado" });
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

// Actualizar un hotel
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { nombre, direccion, categoria } = req.body;
    const result = await connection.execute(
      `UPDATE hotel 
       SET nombre = :nombre, direccion = :direccion, categoria = :categoria 
       WHERE hotel_id = :id`,
      { nombre, direccion, categoria, id: req.params.id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }
    res.json({ ...req.body, hotel_id: req.params.id });
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

// Eliminar un hotel
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "DELETE FROM hotel WHERE hotel_id = :id",
      [req.params.id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }
    res.json({ message: "Hotel eliminado exitosamente" });
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
