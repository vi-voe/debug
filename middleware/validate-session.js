const jwt = require("jsonwebtoken");
const { sequelize, Sequelize } = require("../db");
const User = require("../models/user")(sequelize, Sequelize);
const ANSWER = require("../vars");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();   // allowing options as a method for request
    } else {
        var sessionToken = req.headers.authorization;
        if (!sessionToken) return res.status(403).send({ auth: false, message: ANSWER.error.token });
        else {
            jwt.verify(sessionToken, ANSWER.success.start, (err, decoded) => {
                if (decoded) {
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        console.log(`user: ${user}`)
                        next()
                    },
                        function () {
                            res.status(401).send({ error: ANSWER.error.auth });
                        })

                } else {
                    res.status(400).send({ error: ANSWER.error.auth })
                }
            });
        }
    }
}