const { validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");

const dotenv = require("dotenv").config();
const db = require("../config/db.js");

//@desc TEST
//@route GET /baccarat
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    res.status(201).send({ result: "Conected to baccarat" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /baccarat/get/:game_type_id/:table_limit_id/:limit
//@access private
const getBaccaratData = async (req, res) => {
  const errors = validationResult(req);
  let data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Step 1: Get the last 10 distinct shoe_no
    const shoeNoSql = `
        SELECT DISTINCT shoe_no
        FROM baccarat
        WHERE game_type_id = ? AND table_limit_id = ?
        ORDER BY baccarat_id DESC
        LIMIT ${req.params.limit || 10}
      `;

    const shoeNoValues = [req.params.game_type_id, req.params.table_limit_id];

    // Execute the query to get the last 10 shoe_no
    db.query(shoeNoSql, shoeNoValues, (err, shoeNosResult) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }

      if (shoeNosResult.length === 0) {
        return res.status(404).send({ message: "No shoe_no records found" });
      }

      // Extract shoe_no values from the result
      const shoeNos = shoeNosResult.map((row) => row.shoe_no);

      // Step 2: Use the fetched shoe_no values in the main query
      const mainSql = `
          SELECT *
          FROM baccarat
          WHERE game_type_id = ? AND table_limit_id = ? AND shoe_no IN (?)
          ORDER BY baccarat_id DESC
        `;

      const mainValues = [
        req.params.game_type_id,
        req.params.table_limit_id,
        shoeNos,
      ];

      db.query(mainSql, mainValues, (err, result) => {
        if (err) {
          console.log("error", err);
          return res.status(400).send({ error: err });
        }
        if (result.length === 0) {
          return res.status(404).send({ message: "No records found" });
        }
        res.status(200).send({ result: result });
      });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /baccarat/get/:game_type_id/:table_limit_id/:from_shoe_no/:to_shoe_no
//@access private
const getBaccaratDataFromTo = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { game_type_id, table_limit_id, from_shoe_no, to_shoe_no } =
      req.params;

    // Step 1: Validate the shoe_no range
    if (!from_shoe_no || !to_shoe_no) {
      return res
        .status(400)
        .send({ message: "from_shoe_no and to_shoe_no are required." });
    }

    // Step 2: Use the fetched shoe_no range in the main query
    const mainSql = `
            SELECT *
            FROM baccarat
            WHERE game_type_id = ? 
              AND table_limit_id = ? 
              AND shoe_no BETWEEN ? AND ?
            ORDER BY baccarat_id DESC
        `;

    const mainValues = [game_type_id, table_limit_id, from_shoe_no, to_shoe_no];

    db.query(mainSql, mainValues, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "No records found" });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /baccarat/get/by/shoe/:game_type_id/:table_limit_id/:shoe_no
//@access private
const getBaccaratDataByShoeNo = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { game_type_id, table_limit_id, shoe_no } = req.params;

    // Step 1: Validate the shoe_no
    if (!shoe_no) {
      return res.status(400).send({ message: "shoe_no is required." });
    }

    // Step 2: Use the fetched shoe_no in the main query
    const mainSql = `
            SELECT *
            FROM baccarat
            WHERE game_type_id = ? 
              AND table_limit_id = ? 
              AND shoe_no = ?
            ORDER BY baccarat_id DESC
        `;

    const mainValues = [game_type_id, table_limit_id, shoe_no];

    db.query(mainSql, mainValues, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "No records found" });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route POST /baccarat/get/by/date/:game_type_id/:table_limit_id
//@access private
const getBaccaratDataByDate = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("data: ", data);

    const toDateTime = data.to_date + " 23:59:59";

    const sql = `SELECT * FROM baccarat WHERE game_type_id = ? AND table_limit_id = ? AND date_time BETWEEN ? AND ?`;
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

//@desc Get distinct shoe_no
//@route GET /game/get/shoes/:game_type_id/:table_limit_id
//@access private
const getDistinctShoeNo = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sql = `SELECT DISTINCT shoe_no FROM baccarat WHERE game_type_id = ? AND table_limit_id = ? ORDER BY shoe_no DESC`;

    const values = [req.params.game_type_id, req.params.table_limit_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ result: result.map((row) => row.shoe_no) });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

module.exports = {
  Test,
  getDistinctShoeNo,
  getBaccaratData,
  getBaccaratDataFromTo,
  getBaccaratDataByDate,
  getBaccaratDataByShoeNo,
};
