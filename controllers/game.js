const { validationResult, matchedData } = require('express-validator');
const mysql = require('mysql');

const dotenv = require('dotenv').config();
const db = require('../config/db.js');

//@desc TEST
//@route GET /game
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    res.status(201).send({ result: 'Conected to game' });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Get game data
//@route GET /game/get/all/games
//@access private
const getAllGames = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sql = `SELECT * FROM game_type `;

    /*  ORDER BY date_time DESC AND */

    db.query(sql, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log('error', error);
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
    const sql = `SELECT * FROM ${req.params.game} WHERE game_type_id = ? AND table_limit_id = ? ORDER BY ${req.params.game + '_id'} DESC LIMIT ${req.params.limit || '100'}`;

    /*  ORDER BY date_time DESC AND */
    const values = [req.params.game_type_id, req.params.table_limit_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log('error', error);
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
    console.log('data: ', data);

    const toDateTime = data.to_date + ' 23:59:59';

    const sql = `SELECT * FROM ${req.params.game} WHERE game_type_id = ? AND table_limit_id = ? AND date_time BETWEEN ? AND ?`;
    const values = [req.params.game_type_id, req.params.table_limit_id, data.from_date, toDateTime];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log('error', error);
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
    const sql = `SELECT * FROM ${req.params.game} WHERE game_type_id = ? AND table_limit_id = ? ORDER BY date_time DESC LIMIT ${req.params.limit || '100'}`;
    const values = [req.params.game_type_id, req.params.table_limit_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }
      res.status(200).send({ result: result });
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error: error });
  }
};

//@desc Get latest 100 records for the last updated table_limit_id
//@route GET /game/latest/:game
//@access private
const getLatestRecords = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { game } = req.params;

    // Query to find the latest table_limit_id
    const findLastUpdatedSql = `SELECT table_limit_id FROM ${game} ORDER BY date_time DESC LIMIT 1`;

    db.query(findLastUpdatedSql, (err, lastUpdatedResult) => {
      if (err) {
        console.log('error', err);
        return res.status(400).send({ error: err });
      }

      if (lastUpdatedResult.length === 0) {
        return res.status(404).send({ message: 'No records found' });
      }

      const lastTableLimitId = lastUpdatedResult[0].table_limit_id;

      // Query to get latest records with game_type_name and table_limit_name
      const getLatestRecordsSql = `
        SELECT g.*, gt.game_type_name, tl.table_limit_name
        FROM ${game} g
        INNER JOIN game_type gt ON g.game_type_id = gt.game_type_id
        INNER JOIN table_limit tl ON g.table_limit_id = tl.table_limit_id
        WHERE g.table_limit_id = ?
        ORDER BY g.date_time DESC
        LIMIT 100
      `;

      db.query(getLatestRecordsSql, [lastTableLimitId], (err, result) => {
        if (err) {
          console.log('error', err);
          return res.status(400).send({ error: err });
        }

        if (result.length === 0) {
          return res.status(404).send({ message: 'No records found for the last updated table_limit_id' });
        }

        res.status(200).send({ result });
      });
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
};

/* 
tables
3_card_poker,
andar_bahar,
baccarat,
roulette

*/

//@desc Delete records older than the given date
//@route DELETE /game/older-than/:game
//@access private
const deleteOldRecords = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { days } = req.body; // Number of days passed in the request body

    // Validate the days input
    if (days == null || isNaN(days) || days <= 0) {
      return res.status(400).json({ message: 'Invalid or missing days parameter.' });
    }

    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // List of tables to delete records from
    const tables = ['3_card_poker', 'andar_bahar', 'baccarat', 'roulette'];
    let totalAffectedRows = 0;
    let results = [];

    // Function to delete old records from a single table
    const deleteFromTable = table => {
      return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${table} WHERE date_time < ?`;
        db.query(sql, [cutoffDate], (err, result) => {
          if (err) {
            return reject(err);
          }
          totalAffectedRows += result.affectedRows;
          results.push({ table, affectedRows: result.affectedRows });
          resolve();
        });
      });
    };

    // Execute delete queries for each table
    const deletePromises = tables.map(table => deleteFromTable(table));

    // Wait for all delete queries to complete
    await Promise.all(deletePromises);

    res.status(200).json({
      message: `Records older than ${days} days successfully deleted from ${tables.join(', ')}.`,
      results,
      totalAffectedRows
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
};


module.exports = { deleteOldRecords };

module.exports = { Test, getAllGames, getGameData, getGameDataByDate, getLatestRecords, deleteOldRecords };
