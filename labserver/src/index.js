import Practice from "./practice/practice.js";
import metadata from "./practice/metadata.yml";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const dataIds = Object.keys(metadata.data);

const practice = new Practice();
practice.init();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("new socket connection");

  const connections = await io.fetchSockets();
  if (connections.length > 1) {
    console.log(
      "connection rejected: can't have more than one connection at the same time"
    );
    socket.emit("setup", {
      status: "error",
      message: "No se puede tener más de una conexión al mismo tiempo",
    });
    socket.disconnect();
  }

  setInterval(() => {
    const dataValues = dataIds.reduce(
      (previous, dataId) => ({
        ...previous,
        [dataId]: practice[dataId],
      }),
      {}
    );

    socket.emit("updatePracticeData", {
      status: practice.status,
      dataValues,
    });
  }, 500);

  socket.on("setup", ({ user, password, initialize }) => {
    if (user === "admin" && password === "admin") {
      try {
        socket.emit("setup", { status: "success", metadata });
        if (initialize) {
          practice.init();
        }
      } catch (e) {
        socket.emit("setup", {
          status: "error",
          message: e,
        });
      }
    } else {
      socket.emit("setup", {
        status: "ERROR",
        message: "Usuario o contraseña incorrecto",
      });
    }
  });

  socket.on("command", (command, value) => {
    console.log("Command received", { command, value });
    const result = practice.command(command, value);
    if (result.status === "error") {
      socket.emit("message", {
        status: "error",
        message: result.message,
      });
    } else {
      socket.emit("message", {
        status: "success",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

httpServer.listen(8000);
console.log("connected");
