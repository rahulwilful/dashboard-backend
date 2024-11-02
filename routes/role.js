const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  Test,
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole

} = require("../controllers/role.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc TEST
//@route GET /role/
//@access Public
router.get("/", Test);

//@desc Get all roles
//@route GET /role/
//@access Private
router.get("/get/all", validateToken,getRoles);

//@desc Get a role by ID
//@route GET /role/:id
//@access Private
router.get("/:id", validateToken,getRoleById);

//@desc Add a new role
//@route POST /role/add
//@access Private
router.post("/add", validateToken,addRole);

//@desc Update a role
//@route PUT /role/update/:id
//@access Private
router.put("/update/:id", validateToken,updateRole);

//@desc Delete a role
//@route DELETE /role/delete/:id
//@access Private
router.delete("/delete/:id", validateToken,deleteRole);
module.exports = router;
