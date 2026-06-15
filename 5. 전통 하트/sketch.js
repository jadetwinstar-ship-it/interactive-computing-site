let maxW = 50;
let arrows = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let cols = ceil(width / maxW) + 1;
  let rows = ceil(height / maxW) + 1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * maxW;
      let y = j * maxW;
      arrows.push(new RotatingArrow(x, y, maxW));
    }
  }
}

function draw() {
  background('#2E2823');

  for (let arrow of arrows) {
    arrow.update();
    arrow.show();
  }
}

class RotatingArrow {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w * 1.55;
    this.rad = 0;
    this.currentColor = color(0);
    this.bottomColor = color(0);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.rad + PI / 2);
    noStroke();

    let s = this.w * 0.55;

    fill(this.bottomColor);
    push();
    scale(1.2);
    beginShape();
    vertex(0, s / 2);
    bezierVertex(-s, -s / 2, -s / 2, -s, 0, -s / 4);
    bezierVertex(s / 2, -s, s, -s / 2, 0, s / 2);
    endShape(CLOSE);
    pop();

    fill(this.currentColor);
    beginShape();
    vertex(0, s / 2);
    bezierVertex(-s, -s / 2, -s / 2, -s, 0, -s / 4);
    bezierVertex(s / 2, -s, s, -s / 2, 0, s / 2);
    endShape(CLOSE);

    pop();
  }

  update() {
    this.rad = atan2(mouseY - this.y, mouseX - this.x);
    let distance = dist(this.x, this.y, mouseX, mouseY);
    let colorAmt = map(distance, 0, 800, 0, 1, true);

    let bgColor = color('#2E2823');
    let targetPink = color('#C8315E');
    let targetGreen = color('#43A298');

    this.currentColor = lerpColor(targetPink, bgColor, colorAmt);
    this.bottomColor = lerpColor(targetGreen, bgColor, colorAmt);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// let colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'];

// let w = 200;

// let steps = 0;
// let dir = 1;
// let incr = w * 0.02;

// let crossrects = [];
// let cols, rows;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noStroke();

//   cols = ceil(width / w) + 1;
// 	rows = ceil(height / w) + 1;

// 	for (let i = 0; i < cols; i++) {
// 		for (let j = 0; j < rows; j++) {
// 			let x = i * w;
// 			let y = j * w;
//       let crossR = new CrossRect(300, 300);
// 			crossrects.push(crossR);
// 		}
// 	}
// }

// function timer() {
//    steps += 4*dir;
//   if(steps > w || steps < -w) {
//     dir *= (-1);
//   }
// }

// function draw() {
//   background(255);

//   for(let crossR of crossrects) {
//     crossR.show();
//     crossR.update();
//   }

//   // steps += incr * dir;
// 	// if (steps > w || steps < -w) {
// 	// 	dir *= (-1);
// 	// }

// }

// class CrossRect {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.centerW = w;
//     this.leftW = 0;
//     this.rightW = 0;
//     this.bottomCol = random(colors);
//     this.centerCol = random(colors);
//     this.rightCol = random(colors);
//     this.leftCol = random(colors);
//   }

//   show() {
//     push();
//     translate(this.x, this.y);

//     rectMode(CENTER);
//     fill(this.bottomCol);
//     rect(0, 0, w);

//     rectMode(CORNER);
//     fill(this.leftCol);
//     rect(-w/2, -w/2, this.leftW);

//     rectMode(CORNER);
//     fill(this.leftCol);
//     rect(w/2, w/2, this.rightW);

//     rectMode(CENTER);
//     fill(this.centerCol);
//     rect(0, 0, this.centerW);
//     pop();
//   }

//   update() {
//     this.centerW = steps;
//     this.rightW = map(steps, -w, w, 0, -w);
//     this.leftW = map(steps, -w, w, 0, w);
//   }
// }
