const express = require("express");
const path = require("path");

const router = express.Router();
const gameController = require("../controller/gameController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../view/index.html"));
});

router.post("/move", (req, res) => {
  console.log(req.body);
  res.send(
    JSON.stringify({
      result: "Ход засчитан",
    })
  );
});

module.exports = router;
