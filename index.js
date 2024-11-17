//409 for duplicate

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(express.json());
app.use(cors());

//app.use("/words", require("./routes/words.js"));



app.use("/table/limits", require("./routes/tableLimits.js"));
app.use("/config", require("./routes/config.js"));
app.use("/game", require("./routes/game.js"));
app.use("/baccarat", require("./routes/baccarat.js"));
app.use("/user", require("./routes/user.js"));
app.use("/role", require("./routes/role.js"));

app.listen("5000", () => {
  console.log("Server started on port 5000");
});

