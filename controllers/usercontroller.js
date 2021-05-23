const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const ANSWER = require("../vars");
const CRYPT_SIZE = 10;
const EXPIRES_VAL = 60 * 60 * 24;

const { sequelize, Sequelize } = require("../db");
const User = require("../models/user")(sequelize, Sequelize);

router.post("/signup",  async (req, res) => {
    const user = await User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash:  bcrypt.hashSync(req.body.user.password, CRYPT_SIZE),
        email: req.body.user.email,
    }).catch((err) => { 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
     });
     let token = jwt.sign({ id: user.id }, ANSWER.success.start, { expiresIn: EXPIRES_VAL });
     res.status(StatusCodes.OK).json({
         user: user,
         token: token
     })
})

router.post("/signin", async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.user.username } });
    if (user) {
        bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
            if (matches) {
                var token = jwt.sign({ id: user.id }, ANSWER.success.start, { expiresIn: EXPIRES_VAL });
                res.json({
                    user: user,
                    message: ANSWER.success.auth,
                    sessionToken: token
                });
            } else {
                res.status(StatusCodes.BAD_GATEWAY).send({ error: ANSWER.error.password })
            }
        });
    } else {
        res.status(StatusCodes.FORBIDDEN).send({ error: ANSWER.error.user })
    }
})

module.exports = router;