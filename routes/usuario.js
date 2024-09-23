const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { nombre, apellido, email, tel, telefono, password } = req.body;
    const result = await connection.execute(
      `INSERT INTO usuario (nombre, apellido, email, tel, telefono, password) 
       VALUES (:nombre, :apellido, :email, :tel, :telefono, :password) 
       RETURNING user_id INTO :id`,
      {
        nombre,
        apellido,
        email,
        tel,
        telefono,
        password,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true }
    );
    res.status(201).json({ ...req.body, user_id: result.outBinds.id[0] });
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

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute("SELECT * FROM usuario", [], {
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

// Obtener un usuario específico
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "SELECT * FROM usuario WHERE user_id = :id",
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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

// Actualizar un usuario
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { nombre, apellido, email, tel, telefono, password } = req.body;
    const result = await connection.execute(
      `UPDATE usuario 
       SET nombre = :nombre, apellido = :apellido, email = :email, 
           tel = :tel, telefono = :telefono, password = :password 
       WHERE user_id = :id`,
      { nombre, apellido, email, tel, telefono, password, id: req.params.id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ ...req.body, user_id: req.params.id });
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

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      "DELETE FROM usuario WHERE user_id = :id",
      [req.params.id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado exitosamente" });
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
