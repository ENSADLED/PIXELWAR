import http from "http";
import express from "express";
import { Server } from "socket.io";

import generatePixelData from "./src/generatePixelData.js";
import drawPixel from "./src/drawPixel.js";

// Server settings
const app = express();
const server = http.createServer(app);
const port = process.env.port || 8000;

const io = new Server(server);

// Game settings
const pixelSize = 40;
const canvasWidth = pixelSize*21;
const canvasHeight = pixelSize*21;

const REST_TIME_MS = 15000;

const updateTable = {};

/**
 * {
 *   "QcORuMc0MqOOJSLYAAAN": "2022-04-22T00:19:21.924Z",
 *   "fJY6hfhWokt9W1jbAAAP": "2022-04-22T00:19:28.924Z",
 * }
 */

let pixelData = generatePixelData({
  pixelSize,
  width: canvasWidth,
  height: canvasHeight,
});

// console.table(pixelData);

// Server routes
app.use(express.static("public"));

io.on("connection", (socket) => {
  //console.log(`A user is connected [${socket.id}]`);
  const id =
    process.env.NODE_ENV === "production"
      ? socket.conn.remoteAddress
      : socket.id;
  socket.emit("join-pixel-data", {
    pixelData,
    pixelSize,
    canvasHeight,
    canvasWidth,
  });

  socket.on("update-pixel-data", ({ color, rowIndex, colIndex }) => {
    if (
      color?.length &&
      rowIndex >= 0 &&
      rowIndex < pixelData.length &&
      colIndex >= 0 &&
      colIndex < pixelData[0].length
    ) {
      let canUpdatePixel = false;
      let elapsedMs = 0;  // Déclarer elapsedMs avec une valeur par défaut

      // console.log("#1");
      if (!updateTable.hasOwnProperty(id)) {
        // console.log("#2");
        canUpdatePixel = true;
      } else {
        // console.log("#3");
        const ms = new Date(updateTable[id]).getTime();
        elapsedMs = new Date().getTime() - ms;  // Affecter elapsedMs ici
        if (elapsedMs >= REST_TIME_MS) {
          // console.log("#4");
          canUpdatePixel = true;
          console.log(elapsedMs - REST_TIME_MS);
        }
      }

      if (!canUpdatePixel) {
        // console.log("#5");
        socket.emit("cannot-update");
        return;
      }

      // console.log("#6");

      updateTable[id] = new Date().getTime();

      const remainingTime = REST_TIME_MS - elapsedMs;

      // Émettre le temps restant aux clients
      io.emit("update-remaining-time", remainingTime);

      drawPixel({
        pixelData,
        color,
        rowIndex,
        colIndex,
      });

      // console.log("pixelData", pixelData);

      io.emit("update-pixel-data", pixelData);
    }
  });
});

server.listen(port, ()=>{
  console.log(`Listening port on ${port}`)
});
// Server start
/*server.listen(3000, () => {
  console.log("Server started");
});*/

