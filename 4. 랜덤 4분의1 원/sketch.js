let bCols = ['#FDDBF3', '#CDF1CE', '#FDFBDB', '#383232'];
let fCols = ['#FFEBA2', '#F08080', '#96CF97', '#ADC4E3', '#676161', '#E99AD2'];
let wd = 110;
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER); 
  noStroke();
  noLoop();

  cols = ceil(width / wd);
  rows = ceil(height / wd);

  drawPattern();
}

function drawPattern() {
  background(255);
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * wd;
      let y = row * wd;
      
      let currentBCol = random(bCols);
      fill(currentBCol);
      rect(x, y, wd, wd);
      
      drawRandomQuarter(x, y, wd, currentBCol);
    }
  }
}

function drawRandomQuarter(x, y, w, bgCol) {
  push();
  translate(x + w / 2, y + w / 2);
  let rotations = [0, HALF_PI, PI, PI + HALF_PI];
  rotate(random(rotations));
  fill(random(fCols));
  arc(-w/2, -w/2, w * 2, w * 2, 0, HALF_PI);
  if (bgCol === '#383232') {
    fill(255);
    ellipse(-w/3.5, -w/3.5, w * 0.12); 
  }
  pop();
}

function mousePressed() {
  drawPattern();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / wd);
  rows = ceil(height / wd);
  drawPattern();
}

// let bCols = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'];
// let fCols = ["#FF5F5F", "#F8907C", "#FFC2A7", "#FFEC57", "#9EF2BB", "#6CBAF4", "#4AD0E8"];
// let wd = 200;
// let cols, rows;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   rectMode(CENTER);
//   noStroke();
//   noLoop();

//   cols = ceil(width / wd);
//   rows = ceil(height / wd);

//   drawPattern();

// }

// function drawPattern() {

//   for(let col=0; col<=cols; col++) {
//     for(let row=0; row<=rows; row++) {
//       let x = col * wd;
//       let y = row * wd;
//       drawRect(x, y, wd);
//       drawPetals(x, y, wd)
//     }
//   }
//   // for(let x = 0; x<width + 1000; x+=wd) {
//   //   for(let y = 0; y < height +1000; y+=wd) {
//   //     drawRect(x, y, wd);
//   //     drawPetals(x, y, wd);
//   //   }
//   // }
// }

// function drawRect(x, y, w) {
//   fill(random(bCols));
//   rect(x, y, w);
// }

// function drawPetals(x, y, w) {
//   let halfW = w / 2;
//   let eightthW = w / 8;
//   let twelvethW = w / 12;
//   for(let theta=0; theta<2*PI; theta+=PI/2) {
//     push();
//     translate(x, y);
//     rotate(theta);
//     fill(random(fCols));
//     beginShape();
//     vertex(0, 0);
//     bezierVertex(eightthW, 0, halfW - eightthW -twelvethW, +eightthW -twelvethW, halfW - eightthW, +eightthW);
// 	  bezierVertex(halfW - eightthW +twelvethW, +eightthW +twelvethW, halfW, halfW - eightthW, halfW, halfW);
// 	  bezierVertex(halfW - eightthW, halfW, +eightthW +twelvethW, halfW - eightthW +twelvethW, +eightthW, halfW - eightthW);
// 	  bezierVertex(+eightthW -twelvethW, halfW - eightthW -twelvethW, 0, eightthW, 0, 0);
//     endShape();
//     pop();
//   }
// }

// function mousePressed() {
//   background(255);

//   drawPattern();
// }

// function draw() {
//   // background(255);
//   // noStroke();
//   // noLoop();

//   // for(let x = 0; x<width + 1000; x+=wd) {
//   //   for(let y = 0; y < height +1000; y+=wd) {
//   //     drawRect(x, y, wd);
//   //     drawPetals(x, y, wd);
//   //   }
//   // }

//   // drawRect(400, 400);
//   // drawPetals(400, 400);
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);

//   cols = ceil(width / wd);
//   rows = ceil(height / wd);

//   drawPattern();
// }
