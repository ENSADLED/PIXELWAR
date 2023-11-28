const drawPixel = ({ pixelData, color, rowIndex, colIndex }) => {
  pixelData[rowIndex][colIndex] = color;
  //console.table(pixelData);
};

export default drawPixel;
