import firstDrawPixel from "./pixel/firstDrawPixel.js";
import drawPixel from "./pixel/drawPixel.js";
import onClickColor from "./events/onClickColor.js";
import onClickPixel from "./events/onClickPixel.js";

const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

let selectedColor = null;
let pixelSizeFront = null;

const socket = io();
const remainingTimeElement = document.getElementById("remaining-time");

socket.on(
  "join-pixel-data",
  ({ pixelData, pixelSize, canvasWidth, canvasHeight }) => {
    pixelSizeFront = pixelSize;
    firstDrawPixel({
      canvasEl,
      ctx,
      pixelData,
      pixelSize,
      canvasWidth,
      canvasHeight,
    });
    onClickPixel({
      canvasEl,
      pixelSize,
      callback: ({ rowIndex, colIndex }) => {
        socket.emit("update-pixel-data", {
          color: selectedColor,
          rowIndex,
          colIndex,
        });
        if (canremain) {
          startCountdown();
        }
      },
    });
  }
);

socket.on("update-pixel-data", (pixelData) => {
  //console.table("pixelData", pixelData);
  drawPixel({
    ctx,
    pixelData,
    pixelSize: pixelSizeFront,
    canvasWidth: canvasEl.width,
    canvasHeight: canvasEl.height,
  });
});

socket.on("cannot-update", () => {
  alert(
    "Calme-toi mon ami ! Attends un peu, avant de dessiner un nouveau pixel :)"
  );
});

let canremain =true;

function updateRemainingTime(remainingTime) {
  // Mettez à jour le contenu de l'élément avec le temps restant
  remainingTimeElement.textContent = Math.floor(remainingTime / 1000);

  // Vous pouvez également ajouter des styles ou des classes CSS pour changer l'apparence si nécessaire
  if (remainingTime <= 0) {
    // Le temps est écoulé, appliquez un style différent
    remainingTimeElement.style.color = "white";
    canremain =true;
  } else {
    // Le temps n'est pas encore écoulé, réinitialisez le style
    remainingTimeElement.style.color = "red";
    canremain =false;
  }
}

// Fonction pour déclencher le décompte de 10 secondes
function startCountdown() {

  let remainingTime = 15000; // Temps initial en millisecondes (10 secondes)
  updateRemainingTime(remainingTime);

  const countdownInterval = setInterval(() => {
    remainingTime -= 1000; // Soustrayez 1 seconde (1000 ms) du temps restant
    updateRemainingTime(remainingTime);

    if (remainingTime <= 0) {
      // Le décompte est terminé, effacez l'intervalle
      clearInterval(countdownInterval);
      
    }
  }, 1000); // Répétez toutes les 1 seconde (1000 ms)
}


onClickColor({
  callback: (color) => {
    selectedColor = color;
  },
});
