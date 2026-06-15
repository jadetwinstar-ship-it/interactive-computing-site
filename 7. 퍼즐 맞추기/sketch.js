let img;
let maskImg;
let tileWidth = 40;
let visualScale = 1.2;
let tiles = [];

function preload() {
  img = loadImage('puzzle.jpg');
  maskImg = loadImage('Union.png');
}

function setup() {
  createCanvas(1280, 1014);
  background(255);

  let renderSize = tileWidth * visualScale;
  let offset = (renderSize - tileWidth) / 2;
  maskImg.resize(renderSize, renderSize);

  for (let x = 0; x < width; x += tileWidth) {
    for (let y = 0; y < height; y += tileWidth) {
      let tileGraphic = img.get(x - offset, y - offset, renderSize, renderSize);
      tileGraphic.mask(maskImg);

      tiles.push({
        img: tileGraphic,
        x: x - offset,
        y: y - offset
      });
    }
  }
  
  shuffle(tiles, true);
}

function draw() {
  if (tiles.length > 0) {
    let tile = tiles.pop();
    image(tile.img, tile.x, tile.y);
	
	stroke(50); 
   strokeWeight(20); 
   noFill();
   rectMode(CORNER);
  rect(10, 10, width - 20, height - 20);
  }
}