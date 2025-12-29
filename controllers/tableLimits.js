const { validationResult, matchedData } = require('express-validator');
const mysql = require('mysql');

const dotenv = require('dotenv').config();
const db = require('../config/db.js');

//@desc Get Word
//@route Get /word/test
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    let sql = `select * from wn_word where word = "${data.word}" `;

    res.status(201).send({ result: 'Conected to table limits' });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Get Tables
//@route GET /get/all/tables
//@private Login Required
const getAllTables = async (req, res) => {
  const errors = validationResult(req);

  const id = req.params.game_type_id;

  const data = matchedData(req);

  try {
    const sql = `
      select * from table_limit    
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      res.status(201).send({ message: 'Record retrived successfully', result: result });
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Get Tables
//@route GET /get/tables/:game_type_id
//@private Login Required
const getTable = async (req, res) => {
  const errors = validationResult(req);

  const id = req.params.game_type_id;

  const data = matchedData(req);

  try {
    const sql = `
      select 
        tl.table_limit_id, 
        tl.table_limit_name, 
        tl.min_bet, 
        tl.max_bet, 
        tl.side_bet_min, 
        tl.side_bet_max, 
        tl.ActiveMac,
        tl.s_message, 
        gt.game_type_id, 
        gt.game_type_name, 
        tb.background_id, 
        tb.background, 
        th.theme_id, 
        th.theme,
        tg.language_id,
        tg.language
        
      from table_limit tl 
      left join game_type gt on tl.game_type_id = gt.game_type_id 
      left join table_background tb on tl.background_id = tb.background_id 
      left join table_theme th on tl.theme_id = th.theme_id 
      left join table_language tg on tl.language_id = tg.language_id
      where tl.game_type_id = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      res.status(201).send({ message: 'Record retrived successfully', result: result });
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Get Table Limit
//@route GET /get/limit/table/:id
//@private Login Required
const getTableLimit = async (req, res) => {
  const errors = validationResult(req);

  const id = req.params.id;

  if (errors.isEmpty()) {
    try {
      const sql = `select * from table_limit where table_limit_id = ?`;

      db.query(sql, [id], (err, result) => {
        if (err) {
          console.log('error', err);
          return res.status(400).send({ error: err });
        }
        res.status(201).send({ message: 'Record retrived successfully', result: result[0] });
      });
    } catch (error) {
      console.log('error', error);
      res.status(400).send({ error: error });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

//@desc Add a new record to table_limit
//@route POST /table_limit
//@private Login Required
const addTableLimit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  console.log(data);

  try {
    const sql = `
        INSERT INTO table_limit (
          table_limit_name, date_time, min_bet, max_bet, side_bet_min, side_bet_max,
          s_message, game_type_id, theme_id, language_id, background_id,currency_id,commission
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?
        )
      `;

    const values = [
      data.table_limit_name,
      new Date(), // Current timestamp
      data.min_bet,
      data.max_bet,
      data.side_bet_min,
      data.side_bet_max,
      data.s_message,
      data.game_type_id,
      data.theme_id,
      data.language_id,
      data.background_id, // Corrected to match the number of columns
      data.currency_id,
      data.commission
    ];

    const sql2 = `
    INSERT INTO games_used (
      game_type_id
    ) VALUES (
      ?
    )
  `;

    const values2 = [data.game_type_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      db.query(sql2, values2, (err2, result2) => {
        if (err2) {
          console.log('error', err2);
          return res.status(400).send({ error: err2 });
        }
        res.status(201).send({ message: 'Record added successfully', result: result });
      });
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Update a record in table_limit
//@route PUT /table_limit/:table_limit_id
//@private Login Required
const updateTableLimit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  console.log('data: ', data);
  //return res.status(200).send({ message: "Record updated successfully" });

  try {
    let sql = `
      UPDATE table_limit
      SET min_bet = ${data.min_bet},
          max_bet = ${data.max_bet},
          side_bet_min = ${data.side_bet_min},
          side_bet_max = ${data.side_bet_max},
          s_message = '${data.s_message || ''}',
          theme_id = ${data.theme_id},
          language_id = ${data.language_id},
          background_id = ${data.background_id},
          currency_id = ${data.currency_id},
          commission = ${data.commission || 0}
      WHERE table_limit_id = ${req.params.id}
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }

      if (data.ActiveMac === false) {
        const deleteResult = supportDeleteActiveMac(req.params.id);
        if (deleteResult instanceof Error) {
          return res.status(400).send({ error: deleteResult });
        }
      }

      return res.status(200).send({ message: 'Record updated successfully' });
    });
  } catch (error) {
    console.log('error', error);
    return res.status(400).send({ error: error });
  }
};

const supportDeleteActiveMac = tableLimitId => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE table_limit
      SET ActiveMac = NULL
      WHERE table_limit_id = ?
    `;

    db.query(sql, [tableLimitId], (err, result) => {
      if (err) {
        console.log('error', err);
        return reject(err);
      }
      resolve(true);
    });
  });
};

module.exports = {
  Test,
  getTable,
  getAllTables,
  addTableLimit,
  updateTableLimit,
  getTableLimit
};
