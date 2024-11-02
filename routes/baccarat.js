const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  Test,
  getDistinctShoeNo,
  getBaccaratData,
  getBaccaratDataFromTo,
  getBaccaratDataByDate,
  getBaccaratDataByShoeNo,
} = require("../controllers/baccarat.js");

//@desc TEST
//@route GET /baccarat/
//@access Public
router.get("/", Test);

//@desc TEST
//@route GET /baccarat/get/shoes
//@access Public
router.get("/get/shoes/:game_type_id/:table_limit_id", getDistinctShoeNo);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.get(
  "/get/:game_type_id/:table_limit_id/:limit",

  getBaccaratData
);

//@desc Get game data
//@route GET /baccarat/get/from/to/:game_type_id/:table_limit_id/:from_shoe_no/:to_shoe_no
//@access private
router.get(
  "/get/from/to/:game_type_id/:table_limit_id/:from_shoe_no/:to_shoe_no",
  getBaccaratDataFromTo
);

//@desc Get game data
//@route POST /baccarat/get/from/to/:game_type_id/:table_limit_id/:from_shoe_no/:to_shoe_no
//@access private
router.post(
  "/get/by/date/:game_type_id/:table_limit_id",
  [
    body("from_date", "from_date required"),
    body("to_date", "to_date required"),
  ],
  getBaccaratDataByDate
);

//@desc Get game data
//@route GET /baccarat/get/by/shoe/:game_type_id/:table_limit_id/:shoe_no
//@access private
router.get(
  "/get/by/shoe/:game_type_id/:table_limit_id/:shoe_no",

  getBaccaratDataByShoeNo
);
module.exports = router;
