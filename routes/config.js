const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  Test,
  insertInTableType,

  addTheme,
  addBackground,
  addLanguage,
  addCurrency,

  getLanguage,
  getTheme,
  getBackground,
  getCurrency,

  getTableType,
  getConfigs,

  updateGameType,
  updateTheme,
  updateBackground,
  updateLanguage,
  updateCurrency
} = require("../controllers/config.js");

//@desc TEST
//@route GET /config/
//@access Public
router.get("/", Test);

//@desc Get Word
//@route POST /config/add
//@access Public
router.post(
  "/add/table/type",
  [body("game_type_name", "game_type_name required")],
  insertInTableType
);

//@desc Get Word
//@route POST /add/theme
//@access Public
router.post("/add/theme", [body("theme", "theme required")], addTheme);

//@desc Get Word
//@route POST /add/background
//@access Public
router.post(
  "/add/background",
  [body("background", "background required")],
  addBackground
);

//@desc Get Word
//@route POST /add/language
//@access Public
router.post(
  "/add/language",
  [body("language", "language required")],
  addLanguage
);

//@desc Add Currency
//@route POST /add/currency
//@access Public
router.post(
  "/add/currency",
  [body("currency", "currency required")],
  addCurrency
);

//@desc Get Word
//@route GET /add/language
//@access Public
router.get("/get/language", getLanguage);

//@desc Get Word
//@route GET /get/theme
//@access Public
router.get("/get/theme", getTheme);

//@desc Get Word
//@route GET /get/background
//@access Public
router.get("/get/background", getBackground);

//@desc Get Word
//@route GET /get/currency
//@access Public
router.get("/get/currency", getCurrency);

//@desc Get Word
//@route GET /get/table/type
//@access Public
router.get("/get/table/type", getTableType);

//@desc Get Word
//@route PUT /update/table/type/:id
//@access Public
router.put(
  "/update/game/type/:id",
  [body("game_type_name", "game_type_name required")],
  [body("active", "active required")],
  updateGameType
);

//@desc Get Word
//@route PUT /update/theme/:id
//@access Public
router.put("/update/theme/:id", [body("theme", "theme required")], updateTheme);

//@desc Get Word
//@route PUT /update/background/:id
//@access Public
router.put(
  "/update/background/:id",
  [body("background", "background required")],
  updateBackground
);

//@desc Get Word
//@route PUT /update/language/:id
//@access Public
router.put(
  "/update/language/:id",
  [body("language", "language required")],
  updateLanguage
);

//@desc Update Currency
//@route PUT /update/currency/:id
//@access Public
router.put(
  "/update/currency/:id",
  [body("currency", "currency required")],
  updateCurrency
);

//@desc Get Word
//@route GET /get/configs
//@access Public
router.get("/get/configs", getConfigs);
module.exports = router;
