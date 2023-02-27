import express from "express";
import http from "http";
import { Server } from "socket.io";

import generatePixelData from "./src/generatePixelData.js";
import drawPixel from "./src/drawPixel.js";

// Server settings
const app = express();
const server = http.createServer(app);

const io = new Server(server);

// Game settings
const pixelSize = 40;
const canvasWidth = pixelSize*21;
const canvasHeight = pixelSize*21;

//const REST_TIME_MS = 1000;

//const updateTable = {};

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

let colorPixel = pixelData.pixelColor; //from return generatepixeldata : colors
let timers = pixelData.timers; //from return generatepixeldata : timers

//console.table(timers);
//console.table(colorPixel);

// Server routes
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A user is connected [${socket.id}]`);
  const id =
    process.env.NODE_ENV === "production"
      ? socket.conn.remoteAddress
      : socket.id;
  socket.emit("join-pixel-data", {
    colorPixel,
    timers,
    pixelSize,
    canvasHeight,
    canvasWidth,
  });

  socket.on("update-pixel-data", ({ color, rowIndex, colIndex }) => {
    if (
      color?.length &&
      rowIndex >= 0 &&
      rowIndex < colorPixel.length &&
      colIndex >= 0 &&
      colIndex < colorPixel[0].length
    ) {
      
      drawPixel({
        colorPixel,
        timers,
        color,
        rowIndex,
        colIndex,
      });
      //console.table(colorPixel);
      //console.table(timers);

      
      // console.log("pixelData", pixelData);
      io.emit("update-pixel-data", {colorPixel, timers});
    }
  });
});

// Server start
server.listen(3010, () => {
  console.log("Server started");
});


