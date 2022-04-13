const express = require("express");
const app = express();
const mainRouter = require("./app/routes/router");
const config = require("./app/config/index");

app.use(express.json());
app.use(mainRouter);

app.use(express.static(__dirname + "/app/static"));

app.listen(config.port, config.host, () =>
  console.log(`Server listens http://${config.host}:${config.port}`)
);
