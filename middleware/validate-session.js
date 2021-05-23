const jwt = require("jsonwebtoken");
const { sequelize, Sequelize } = require("../db");
const User = require("../models/user")(sequelize, Sequelize);
const { StatusCodes } = require('http-status-codes');
const ANSWER = require("../vars");
const METHOD = "OPTIONS";

module.exports = function (req, res, next) {
    if (req.method === METHOD) {
        next();   // allowing options as a method for request
    } else {
        var sessionToken = req.headers.authorization;
        if (!sessionToken) return res.status(StatusCodes.FORBIDDEN).send({ auth: false, message: ANSWER.error.token });
        else {
            jwt.verify(sessionToken, ANSWER.success.start, async (err, decoded) => {
                if (decoded) {
                    const user = await User.findOne({ where: { id: decoded.id } });
                    if(!user) {
                        res.status(StatusCodes.UNAUTHORIZED).send({ error: ANSWER.error.auth });
                    } else {
                        req.user = user;
                        console.log(`user: ${user}`)
                        next()
                    }
                } else {
                    res.status(StatusCodes.BAD_REQUEST).send({ error: ANSWER.error.auth })
                }
            });
        }
    }
}