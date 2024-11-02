const { validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const db = require("../config/db.js");
const jwt = require("jsonwebtoken");

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

//@desc Get Word
//@route Get /word/test
//@access Public
const Test = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  // console.log("data: ", req.body, data);

  try {
    let sql = `select * from wn_word where word = "${data.word}" `;

    res.status(201).send({ result: "Conected to user table" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error: error });
  }
};

//@desc Create Super Admin
//@route POST /create/superadmin
//@access Public
const createSuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    phone_no,
    roleType,
    limits,
    analysis,
    config,
    settings,
  } = data;
  console.log("data: ", data);

  try {
    const sql_check = `
    SELECT * FROM users WHERE email = ?
  `;

    db.query(sql_check, [email], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }

      if (result.length !== 0) {
        return res.status(409).send({ message: "Email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(data.password, salt);
      const values = [
        name,
        email,
        phone_no,
        password,
        "super_admin",
        true,
        true,
        true,
        true,
        true,
      ];

      const sql = `
    INSERT INTO users (name, email, phone_no, password, roleType, limits, analysis, config, settings,users) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log("error", err);
          return res.status(400).send({ error: err });
        }

        res.status(201).send({ message: "Super Admin created successfully" });
      });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Create User
//@route POST /create/user
//@access Public
const createUser = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if(!req.user) return res.status(401).send({ error: "User not Authorized" });
   if (!req.user) return res.status(401).send({ error: "User not Authorized" });
  if (req.user.roleType !== "super_admin" && req.user.users === false)  return res.status(401).send({ error: "User not Authorized" });

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    const values = [
      data.name,
      data.email,
      data.phone_no,
      password,
      data.roleType,
      data.limits,
      data.analysis,
      data.config,
      data.settings,
      data.users
    ];

    const sql = `
    INSERT INTO users (name, email, phone_no, password, roleType, limits, analysis, config, settings,users) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }

      res.status(201).send({ message: "User created successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};


//@desc Login
//@route POST /login
//@access Public
const Login = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  console.log("data",data)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = data;

    const sql = `SELECT * FROM users WHERE email = ?`;
   
    db.query(sql, [email], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
     
      if (result.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }
    
      const user = result[0];
      console.log("user", user.active);
      if(user.active == false) return res.status(403).send({ message: "User is Forbidden" });

      const isMatch = bcrypt.compare(password, user.password);
     
      if (!isMatch) {
        return res.status(401).send({ message: "Password incorrect" });
      }

     
      const token = jwt.sign({user:user}, process.env.ACCESS_TOKEN_SECERT, {
        expiresIn: "100h",
      });
     
      res.status(200).send({ token });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};


//@desc Delete User
//@route DELETE /user/:id
//@access Public
const deleteUser = async (req, res) => {
  if(!req.user) return res.status(401).send({ error: "User not Authorized" });
  try {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Update User
//@route PUT /user/update/:id
//@access Public
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  console.log("data: ", data);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if(!req.user) return res.status(401).send({ error: "User not Authorized" });

  try {
    const sql = `
    UPDATE users SET name = ?, email = ?, phone_no = ? WHERE user_id = ?
  `;
    const values = [data.name, data.email, data.phone_no, req.params.id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ message: "User updated successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Update User by Super Admin
//@route PUT /superadmin/user/:id
//@access Public
const updateUserBySuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.user) return res.status(401).send({ error: "User not Authorized" });
  if (req.user.roleType !== "super_admin" && req.user.users === false) {
    return res.status(401).send({ error: "User not Authorized" });
  }

  try {
    const sql = `
    UPDATE users SET name = ?, email = ?, phone_no = ?, roleType = ?, limits = ?, analysis = ?, config = ?, settings = ?, users = ? WHERE user_id = ?
    `;
    const values = [
      data.name,
      data.email,
      data.phone_no,
      data.roleType,
      data.limits,
      data.analysis,
      data.config,
      data.settings,
      data.users,
      req.params.id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(200)
        .send({ message: "User updated by Super Admin successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};


//@desc Toggle Active
//@route PUT /user/toggle/active/:id
//@access Public
const toggleActive = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.user) return res.status(401).send({ error: "User not Authorized" });
  if (req.user.roleType !== "super_admin" && req.user.users === false) {
    return res.status(401).send({ error: "User not Authorized" });
  }

  try {
    const sql = `
    UPDATE users SET active = !active WHERE user_id = ?
    `;
    const values = [req.params.id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ message: "User active toggled successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Update Password
//@route PUT /user/password/:id
//@access Public
const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  console.log("data: ", data);
  if (!req.user) return res.status(401).send({ error: "User not Authorized" });

  try {
    const sql = `SELECT password FROM users WHERE user_id = ?`;
    db.query(sql, [req.params.id], async (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }
      const validPassword = await bcrypt.compare(
        data.current_password,
        result[0].password
      );
      if (!validPassword) {
        return res.status(401).send({ error: "Incorrect current password" });
      }
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.new_password, salt);

      const sql2 = `UPDATE users SET password = ? WHERE user_id = ?`;
      db.query(sql2, [password, req.params.id], (err2, result2) => {
        if (err2) {
          console.log("error", err2);
          return res.status(400).send({ error: err2 });
        }
        res.status(200).send({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Update Password by Super Admin
//@route PUT /superadmin/password/:id
//@access Public
const updatePasswordBySuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  const data = matchedData(req);
  if(!req.user) return res.status(401).send({ error: "User not Authorized" });
  if (!req.user) return res.status(401).send({ error: "User not Authorized" });
  if (req.user.roleType !== "super_admin" && req.user.users === false) return res.status(401).send({ error: "User not Authorized" });
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);

    const sql = `UPDATE users SET password = ? WHERE user_id = ?`;
    db.query(sql, [password, req.params.id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res
        .status(200)
        .send({ message: "Password updated by Super Admin successfully" });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Get Users
//@route GET /users
//@access Public
const getUsers = async (req, res) => {
  if(!req.user) return res.status(401).send({ error: "User not Authorized" });
  try {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ users: result });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Get User by ID
//@route GET /user/:id
//@access Public
const getUserById = async (req, res) => {
  if(!req.user) return res.status(401).send({ error: "User not Authorized" });
  if(req.user.roleType != "super_admin" && req.user.users == false) return res.status(400).send({ error: "User not Authorized" });
 
  console.log(" getUserById", req.user);
  try {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      res.status(200).send({ user: result[0] });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Get Current User
//@route GET /user/current
//@access Public
const getCurrent = async (req, res) => {
  if(!req.user) return res.status(401).send({ error: "User not found" });
  console.log(" req.user", req.user);
  try {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sql, [req.user.id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if(!result) return res.status(400).send({ error: "User not found" });
      res.status(200).send({ user: result });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

//@desc Get Current User
//@route GET /user/current
//@access Public
const getCurrent2 = async (req, res) => {
  if(!req.user) return res.status(401).send({ error: "User not found" });
  console.log(" req.user", req.user);
  try {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sql, [req.user.id], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err });
      }
      if(!result) return res.status(400).send({ error: "User not found" });
      res.status(200).send({ user: req.user });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({ error: error });
  }
};

module.exports = {
  Test,
  createSuperAdmin,
  createUser,
  Login,

  deleteUser,
  updateUser,
  updatePassword,
  
  updateUserBySuperAdmin,
  updatePasswordBySuperAdmin,
  toggleActive,
  

  
  getUsers,
  getUserById,
  getCurrent,
  getCurrent2
};
