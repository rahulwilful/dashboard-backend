const { validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");

const dotenv = require("dotenv").config();
const db = require("../config/db.js");

//@desc Get Word
//@route Get /role/
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
 

  try {
   

    res.status(201).send({ result: "Conected to Role" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

/* 

CREATE TABLE roles (
  id INT PRIMARY KEY,
  role VARCHAR(50)
);

INSERT INTO roles (id, role) VALUES
(1, 'super_admin'),
(2, 'user'),
(3, 'supervisor'),
(4, 'admin');
*/

//@desc Get all roles
//@route GET /role/
//@access Public
const getRoles = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  try {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(201).send({ roles: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get a role by ID
//@route GET /role/:id
//@access Public
const getRoleById = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  try {
    const id = req.params.id;
    const sql = `SELECT * FROM roles WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Role not found" });
      }
      res.status(201).send({ role: result[0] });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Add a new role
//@route POST /role/add
//@access Public
const addRole = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  try {
    const sql = `INSERT INTO roles (role) VALUES (?)`;
    db.query(sql, [data.role_name], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(201).send({ message: "Role added successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Update a role
//@route PUT /role/update/:id
//@access Public
const updateRole = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  try {
    const id = req.params.id;
    const sql = `UPDATE roles SET role_name = ? WHERE id = ?`;
    db.query(sql, [data.role_name, id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Role not found" });
      }
      res.status(201).send({ message: "Role updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Delete a role
//@route DELETE /role/delete/:id
//@access Public
const deleteRole = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  try {
    const id = req.params.id;
    const sql = `DELETE FROM roles WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Role not found" });
      }
      res.status(201).send({ message: "Role deleted successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

module.exports = {
  Test,
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole
};
