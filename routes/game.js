const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { Test, getGameData, getAllGames, getGameDataByDate, getLatestRecords, deleteOldRecords } = require('../controllers/game.js');

//@desc TEST
//@route GET /game/
//@access Public
router.get('/', Test);

//@desc Get game data
//@route GET /game/get/all/games
//@access private
router.get(
  '/get/all/games',

  getAllGames
);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.get(
  '/get/:game/:game_type_id/:table_limit_id/:limit',

  getGameData
);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.get(
  '/get/unique/:game/:game_type_id/:table_limit_id/:limit',

  getGameData
);

//@desc Get game data
//@route GET /game/get/:game/:game_type_id/:table_limit_id
//@access private
router.post(
  '/get/:game/:game_type_id/:table_limit_id',
  [body('from_date', 'from_date required'), body('to_date', 'to_date required')],

  getGameDataByDate
);

//@desc Get latest 100 records for the last updated table_limit_id
//@route GET /game/latest/:game
//@access private
router.post('/get/latest/data/of/:game', getLatestRecords, deleteOldRecords);

//@desc Delete records older than the given date
//@route DELETE /game/older-than/:game
//@access private
router.delete('/older-than', deleteOldRecords);

module.exports = router;
