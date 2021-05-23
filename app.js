const express = require("express");
const app = express();
const { sequelize } = require("./db");
const user = require("./controllers/usercontroller");
const game = require("./controllers/gamecontroller");
require("dotenv").config();

sequelize.sync();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", user);
app.use(require("./middleware/validate-session"));
app.use("/api/game", game);
app.listen(process.env.PORT, function() {
    console.log("App is listening on 4000");
})