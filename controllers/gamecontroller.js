const router = require("express").Router();
const { sequelize, Sequelize } = require("../db");
const Game = require("../models/game")(sequelize, Sequelize);
const { StatusCodes } = require('http-status-codes');
const ANSWER = require("../vars");

router.get("/all", async (req, res) => {
    const data = await Game.findAll({ where: { owner_id: req.user.id } });
    if(!data) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ANSWER.error.data
        })
    } else {
        res.status(StatusCodes.OK).json({
            games: data,
            message: ANSWER.success.data
        })
    }
})

router.get("/:id", async (req, res) => {
    const data = await Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
    if(!data) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ANSWER.error.data
        })
    } else {
        res.status(StatusCodes.OK).json({
            game: data
        })
    }   
})

router.post("/create", async (req, res) => {
    if (req.body.game === undefined || req.body.user === undefined) {
        res.status(StatusCodes.BAD_REQUEST).send('WRONG REQUEST');
    } else {
        const newGame = await Game.create({
            title: req.body.game.title,
            owner_id: req.body.user.id,
            studio: req.body.game.studio,
            esrb_rating: req.body.game.esrb_rating,
            user_rating: req.body.game.user_rating,
            have_played: req.body.game.have_played
        }).catch((err) => { 
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
         });
        if(!newGame) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
        } else {
            res.status(StatusCodes.OK).json({
                game: newGame,
                message: ANSWER.success.created
            })
        }
    }
    
})

router.put("/update/:id", async (req, res) => {
    const updatedGame = await Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    },
        {
            where: {
                id: req.params.id,
                owner_id: req.user.id
            }
        }).catch((err) => { 
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })
         });
    if(!updatedGame) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message
        })
    } else {
        res.status(StatusCodes.OK).json({
            game: updatedGame,
            message: ANSWER.success.updated
        })
    }
})

router.delete("/remove/:id", async (req, res) => {
    const game = await Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    if(!game) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.message
        })
    } else {
        res.status(StatusCodes.OK).json({
            game: game,
            message: ANSWER.success.deleted
        })
    }
})

module.exports = router;