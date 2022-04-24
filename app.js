const express = require("express");
const app = express();
// const WSServer = require("express-ws")(express());
// const app = WSServer.app;

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

app.use(express.json());
app.use(express.static(__dirname + "/app/static"));

const mainRouter = require("./app/routes/router");
// const aWss = WSServer.getWss("/");

app.use(mainRouter);

// app.ws("/", (ws, req) => {
//   console.log("Подключение установлено");
//   // ws.send("Ты успешно подключился");
//   ws.on("message", (msg) => {
//     console.log(JSON.parse(msg));
//     console.log(aWss.clients);
//     aWss.clients.forEach(client => client.send(msg));
//   });
// });

app.listen(PORT, HOST, () =>
  console.log(`Server listens http://${HOST}:${PORT}`)
);
