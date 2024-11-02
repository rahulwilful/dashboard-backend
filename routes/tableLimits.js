const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  Test,
  insertInTableLimit,
  updateTableLimit,
  getTable,
  getTableLimit,
} = require("../controllers/tableLimits.js");

//@desc TEST
//@route GET /table/limit/
//@access Public
router.get("/", Test);

//@desc Get Tables
//@route GET /get/tables
//@private Login Required
router.get("/get/tables/:game_type_id", getTable);

//@desc Get Table Limit
//@route GET /get/limit/table/:id
//@private Login Required
router.get("/get/:id", getTableLimit);

//@desc Get Word
//@route POST /table/limit/add
//@access Public
router.post(
  "/add",
  [
    body("table_limit_name", "Table_limit_Name required"),
    body("min_bet", "Min_Bet required"),
    body("max_bet", "Max_Bet required"),
    body("side_bet_min", "Side_Bet_Min required"),
    body("side_bet_max", "Side_Bet_Max required"),
    body("s_message"),
    body("game_type_id", "game_type_id required"),
    body("theme_id", "theme id required"),
    body("language_id", "language_id required"),
    body("background_id", "background_id required"),
  ],
  insertInTableLimit
);

//@desc Get Word
//@route PUT /table/limit/upadate/:id
//@access Public
router.put(
  "/update/:id",
  [
    body("min_bet", "Min_Bet required"),
    body("max_bet", "Max_Bet required"),
    body("side_bet_min", "Side_Bet_Min required"),
    body("side_bet_max", "Side_Bet_Max required"),
    body("s_message"),
    body("theme_id", "theme_id required"),
    body("language_id", "language_id required"),
    body("background_id", "background_id required"),
  ],
  updateTableLimit
);

module.exports = router;
