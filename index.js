const express = require("express");
const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

app.use(express.json());
app.use(express.static(__dirname + "/app/static"));
const mainRouter = require("./app/routes/router");
app.use(mainRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("action", (msg) => {
    console.log(msg);
    socket.broadcast.emit("action", msg);
  });
  socket.on("reset", (msg) => {
    console.log(msg);
    socket.broadcast.emit("reset", msg);
  });
});

server.listen(PORT, HOST, () =>
  console.log(`Server listens http://${HOST}:${PORT}`)
);
