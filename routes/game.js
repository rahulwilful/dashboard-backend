const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  Test,
  getGameData,
  getGameDataByDate,
} = require("../controllers/game.js");

//@desc TEST
//@route GET /game/
//@access Public
router.get("/", Test);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.get(
  "/get/:game/:game_type_id/:table_limit_id/:limit",

  getGameData
);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.get(
  "/get/unique/:game/:game_type_id/:table_limit_id/:limit",

  getGameData
);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.post(
  "/get/:game/:game_type_id/:table_limit_id",
  [
    body("from_date", "from_date required"),
    body("to_date", "to_date required"),
  ],

  getGameDataByDate
);

module.exports = router;
