import drawPixel from "./drawPixel.js";
const firstDrawPixel = ({
  canvasEl,
  ctx,
  pixelData,
  pixelSize,
  canvasWidth,
  canvasHeight,
}) => {
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    //draw grid//
    for (let i = 0; i < 21 ;i++){
      ctx.fillStyle = "white";
      ctx.fillRect(i*pixelSize,0,0.5,canvasHeight+100);
      ctx.fillRect(0,i*pixelSize,canvasWidth+100,0.5);
    }
    

  drawPixel({
    ctx,
    pixelData,
    pixelSize,
    canvasWidth,
    canvasHeight,
  });
};

export default firstDrawPixel;
