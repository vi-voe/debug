const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ANSWER = require("../vars");
const CRYPT_SIZE = 10;
const EXPIRES_VAL = 60 * 60 * 24;

const { sequelize, Sequelize } = require("../db");
const User = require("../models/user")(sequelize, Sequelize);

router.post("/signup",  (req, res) => {
    User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash:  bcrypt.hashSync(req.body.user.password, CRYPT_SIZE),
        email: req.body.user.email,
    })
        .then(
            function signupSuccess(user) {
                console.log(user)
                let token = jwt.sign({ id: user.id }, ANSWER.success.start, { expiresIn: EXPIRES_VAL });
                res.status(200).json({
                    user: user,
                    token: token
                })
            },

            function signupFail(err) {
                res.status(500).send(err.message)
            }
        )
})

router.post("/signin", (req, res) => {
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
                if (matches) {
                    var token = jwt.sign({ id: user.id }, ANSWER.success.start, { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user: user,
                        message: ANSWER.success.auth,
                        sessionToken: token
                    });
                } else {
                    res.status(502).send({ error: ANSWER.error.password })
                }
            });
        } else {
            res.status(403).send({ error: ANSWER.error.user })
        }

    })
})

module.exports = router;