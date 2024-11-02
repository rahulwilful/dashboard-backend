const { validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");

const dotenv = require("dotenv").config();
const db = require("../config/db.js");

//@desc Get Word
//@route Get /word/test
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    res.status(201).send({ result: "Conected to table type" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Add a new record to table_limit
//@route POST /config
//@access Public
const insertInTableType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  try {
    const sql = `
        INSERT INTO game_type (
          game_type_name
         
        ) VALUES (
          ?
        )
      `;

    const values = [data.game_type_name];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(201)
        .send({ message: "Record added successfully", result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Add a new record to table_theme
//@route POST /config/add/theme
//@access Public
const addTheme = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  try {
    const sql = `
        INSERT INTO table_theme (
          theme
        ) VALUES (
          ?
        )
      `;

    const values = [data.theme];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(201)
        .send({ message: "Theme added successfully", result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Add a new record to table_background
//@route POST /table_limit/add/background
//@access Public
const addBackground = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  try {
    const sql = `
        INSERT INTO table_background (
          background
        ) VALUES (
          ?
        )
      `;

    const values = [data.background];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(201)
        .send({ message: "Background added successfully", result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Add a new record to table_language
//@route POST /table_limit/add/language
//@access Public
const addLanguage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  try {
    const sql = `
        INSERT INTO table_language (
          language
        ) VALUES (
          ?
        )
      `;

    const values = [data.language];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(201)
        .send({ message: "Language added successfully", result: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get all languages
//@route GET /table_limit/get/language
//@access Public
const getLanguage = async (req, res) => {
  try {
    const sql = "SELECT * FROM table_language";

    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ languages: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get all themes
//@route GET /table_limit/get/theme
//@access Public
const getTheme = async (req, res) => {
  try {
    const sql = "SELECT * FROM table_theme";

    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ themes: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get all backgrounds
//@route GET /table_limit/get/background
//@access Public
const getBackground = async (req, res) => {
  try {
    const sql = "SELECT * FROM table_background";

    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ backgrounds: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get all table types
//@route GET /table_limit/get/table/type
//@access Public
const getTableType = async (req, res) => {
  try {
    const sql = "SELECT * FROM game_type";

    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      console.log("game_types: ", result);
      res.status(200).send({ game_types: result });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get Word
//@route PUT /update/table/type/:id
//@access Public
const updateGameType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = matchedData(req);

    const sql =
      "UPDATE game_type SET game_type_name = ? WHERE game_type_id = ?";

    const values = [data.game_type_name, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Update theme
//@route PUT /update/theme/:id
//@access Public
const updateTheme = async (req, res) => {
  try {
    const id = req.params.id;
    const data = matchedData(req);

    const sql = "UPDATE table_theme SET theme = ? WHERE theme_id = ?";

    const values = [data.theme, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Update background
//@route PUT /update/background/:id
//@access Public
const updateBackground = async (req, res) => {
  try {
    const id = req.params.id;
    const data = matchedData(req);

    const sql =
      "UPDATE table_background SET background = ? WHERE background_id = ?";

    const values = [data.background, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Update language
//@route PUT /update/language/:id
//@access Public
const updateLanguage = async (req, res) => {
  try {
    const id = req.params.id;
    const data = matchedData(req);

    const sql = "UPDATE table_language SET language = ? WHERE language_id = ?";

    const values = [data.language, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ message: "Record updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Get all configuration data
//@route GET /table_limit/get/configs
//@access Public
const getConfigs = async (req, res) => {
  try {
    const configData = {};

    // Get languages
    const languagesSql = "SELECT * FROM table_language";
    db.query(languagesSql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      configData.languages = result;
    });

    // Get themes
    const themesSql = "SELECT * FROM table_theme";
    db.query(themesSql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      configData.themes = result;
    });

    // Get backgrounds
    const backgroundsSql = "SELECT * FROM table_background";
    db.query(backgroundsSql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      configData.backgrounds = result;
    });

    // Get table types
    const tableTypesSql = "SELECT * FROM game_type";
    db.query(tableTypesSql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      configData.game_types = result;

      res.status(200).send(configData);
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

module.exports = {
  Test,
  insertInTableType,
  insertInTableType,
  addTheme,
  addBackground,
  addLanguage,
  getLanguage,
  getTheme,
  getBackground,
  getTableType,
  getConfigs,
  updateGameType,
  updateTheme,
  updateBackground,
  updateLanguage,
};
