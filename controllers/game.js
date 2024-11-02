const { validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");

const dotenv = require("dotenv").config();
const db = require("../config/db.js");

//@desc TEST
//@route GET /game
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    res.status(201).send({ result: "Conected to game" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
const getGameData = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sql = `SELECT * FROM ${
      req.params.game
    } WHERE game_type_id = ? AND table_limit_id = ? ORDER BY ${
      req.params.game + "_id"
    } DESC LIMIT ${req.params.limit || "100"}`;

    /*  ORDER BY date_time DESC AND */
    const values = [req.params.game_type_id, req.params.table_limit_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route POST /game/get/:game/:game_type_id/:table_limit_id?from_date&to_date
//@access private
const getGameDataByDate = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("data: ", data);

    const toDateTime = data.to_date + " 23:59:59";

    const sql = `SELECT * FROM ${req.params.game} WHERE game_type_id = ? AND table_limit_id = ? AND date_time BETWEEN ? AND ?`;
    const values = [
      req.params.game_type_id,
      req.params.table_limit_id,
      data.from_date,
      toDateTime,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
const getUniqueGameData = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sql = `SELECT * FROM ${
      req.params.game
    } WHERE game_type_id = ? AND table_limit_id = ? ORDER BY date_time DESC LIMIT ${
      req.params.limit || "100"
    }`;
    const values = [req.params.game_type_id, req.params.table_limit_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

module.exports = { Test, getGameData, getGameDataByDate };
