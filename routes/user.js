const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateToken = require("../middleware/validateTokenHandler");

const {
  Test,
  createSuperAdmin,
  createUser,
  Login,

  deleteUser,
  updateUser,
  updatePassword,
  
  updateUserBySuperAdmin,
  updatePasswordBySuperAdmin,
  
  getUsers,
  getUserById,
  getCurrent,
  getCurrent2,
  toggleActive,
} = require("../controllers/user.js");

/*  # Name  Type  Collation Attributes  Null  Default Comments  Extra Action
  1 user_id Primary int(100)      No  None    AUTO_INCREMENT  Change Change Drop Drop 
  2 name  varchar(255)  utf8mb4_general_ci    No  None      Change Change Drop Drop 
  3 email varchar(255)  utf8mb4_general_ci    No  None      Change Change Drop Drop 
  4 phone_no  int(15)     No  None      Change Change Drop Drop 
  5 password  varchar(255)  utf8mb4_general_ci    No  None      Change Change Drop Drop 
  6 roleType  varchar(255)  utf8mb4_general_ci    No  None      Change Change Drop Drop 
  7 limits  tinyint(1)      No  None      Change Change Drop Drop 
  8 analysis  tinyint(1)      No  None      Change Change Drop Drop 
  9 config  tinyint(1)      No  None      Change Change Drop Drop 
  10  settings  tinyint(1)      No  None      Change Change Drop Drop 
 */

//@desc TEST
//@route GET /user/
//@access Public
router.get("/", Test);

//@desc Create Super Admin
//@route POST /user/create/super/admin
//@access Public
router.post(
  "/create/super/admin",
  [
    body("name", "name required"),
    body("email", "email required"),
    body("phone_no", "phone_no required"),
    body("password", "password required"),
  ],
  createSuperAdmin
);

//@desc Create User
//@route POST /user/create/user
//@access Private
router.post(  
  "/add",
  [
    body("name", "name required").notEmpty(),
    body("email", "email required").notEmpty(),
    body("phone_no", "phone_no required").notEmpty(),
    body("roleType", "roleType required").notEmpty(),
    body("limits", "limits required"),
    body("analysis", "analysis required"),
    body("config", "config required"),  
    body("settings", "settings required"),
    body("users", "users required"),
    body("password", "password required").notEmpty(),
  ],
  validateToken,
  createUser
);

//@desc Login
//@route POST /user/login
//@access Public
router.post(
  "/login",
  [
    body("email", "email required"),
    body("password", "password required"),
  ],
  Login
);

//@desc Delete User
//@route DELETE /user/:id
//@access Private
router.delete("/delete/user/:id", validateToken, deleteUser);

//@desc Update User
//@route PUT /user/:id
//@access Private
router.put(
  "/update/:id",
  [
    body("name", "name required"),
    body("email", "email required"),
    body("phone_no", "phone_no required"),
    
  ],
  validateToken,
  updateUser
);

//@desc Update User By Super Admin
//@route PUT /user/:id
//@access Private
router.put(
  "/update/by/super/admin/:id",
  [
    body("name", "name required"),
    body("email", "email required"),
    body("phone_no", "phone_no required"),
    body("roleType", "roleType required"),
    body("limits", "limits required"),
    body("analysis", "analysis required"),
    body("config", "config required"),
    body("settings", "settings required"),
    body("users", "users required"),
  ],
  validateToken,
  updateUserBySuperAdmin
);

//@desc Update Password
//@route PUT /user/:id
//@access Private
router.put(
  "/update/password/:id",
  [
    body("current_password", "password required"),
    body("new_password", "new_password required"),
  ],
  validateToken,
  updatePassword
);

//@desc Update Password By Super Admin
//@route PUT /user/:id
//@access Private
router.put(
  "/update/password/super/admin/:id",
  [
    body("current_password", "password required"),
    body("new_password", "new_password required"),
  ],
  validateToken,
  updatePasswordBySuperAdmin
);

//@desc Get Users
//@route GET /user/
//@access Private
router.get("/get/users", validateToken, getUsers);

//@desc Get User By ID
//@route GET /user/:id
//@access Private
router.get("/get/:id", validateToken, getUserById);



//@desc Get Current User
//@route GET /user/current
//@access Private
router.post("/get/current", validateToken, getCurrent2);

//@desc Get Current User
//@route GET /user/toggle/active/:id
//@access Private
router.put("/toggle/active/:id", validateToken, toggleActive);

module.exports = router;