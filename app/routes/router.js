const express = require('express')
const path = require('path')

const router = express.Router();
const gameController = require('../controller/gameController')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../view/index.html'));
})


router.route('/api/game')
    .get((req, res) => {
        gameController.gamesResult(req, res);
    })
    .post((req, res) => {
        console.log(req.body)
        gameController.finishGame(req, res);
    })



module.exports = router;
