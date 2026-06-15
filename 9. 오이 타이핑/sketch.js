let charballs = [];
let groundY;
let myFont;

function preload() {
  myFont = loadFont('EF_cucumbersalad(ttf).ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height / 2;
  textFont(myFont);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height / 2;
}

function draw() {
  background('#343333');

  noFill();
  stroke('#F8DCCB');
  strokeWeight(1.5);
  ellipse(width / 2, groundY, 150, 40);

  for (let i = 0; i < charballs.length; i++) {
    charballs[i].update(charballs);
    charballs[i].display();
  }
}

function keyPressed() {
  if (key.length === 1) {
    charballs.push(new CharBall(width / 2, groundY, key));
  }
}

class CharBall {
  constructor(_x, _y, _c) {
    this.x = _x;
    this.y = _y;
    this.ch = _c;
    this.vx = random(-6, 6);
    this.vy = random(-10, -18);
    this.g = 0.8;
    this.angle = 0;
    this.size = 48;
    this.isStopped = false;
    this.phase = 0;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    fill('#FB8439');
    noStroke();
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.ch, 0, 0);
    pop();
  }

  update(others) {
    if (this.isStopped) return;

    this.vy += this.g;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += 8;

    if (this.phase === 0 && this.y > height + 50) {
      this.phase = 1;
      this.y = -50;
      
      if (random(1) > 0.5) {
        this.x = random(50, width / 2 - 80);
      } else {
        this.x = random(width / 2 + 80, width - 50);
      }
      
      this.vy = 5;
      this.vx = 0;
    }

    if (this.phase === 1 && this.vy > 0) {
      if (this.y >= groundY) {
        this.stopAt(groundY);
      }

      for (let other of others) {
        if (other !== this && other.isStopped) {
          let d = dist(this.x, this.y, other.x, other.y);
          if (d < this.size * 0.8) {
            this.stopAt(other.y - this.size * 0.7);
          }
        }
      }
    }
  }

  stopAt(newY) {
    this.y = newY;
    this.vy = 0;
    this.vx = 0;
    this.isStopped = true;
    this.angle = random(-90, 90);
  }
}


// let charballs = [];
// let groundY; 

// function setup() {
//   // 1. 캔버스 크기를 브라우저 창 크기에 맞춤
//   createCanvas(windowWidth, windowHeight);
//   groundY = height / 2; 
// }

// // 창 크기가 바뀔 때 캔버스와 바닥 높이를 자동으로 업데이트
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   groundY = height / 2;
// }

// function draw() {
//   background('#343333'); 

//   // 입구 표시 (중앙 정렬 유지)
//   stroke('#FB8439');
//   strokeWeight(4);
//   line(width / 2 - 20, groundY, width / 2 + 20, groundY);

//   for (let i = 0; i < charballs.length; i++) {
//     charballs[i].update(charballs);
//     charballs[i].display();
//   }
// }

// function keyPressed() {
//   if (key.length === 1) {
//     charballs.push(new CharBall(width / 2, groundY, key));
//   }
// }

// class CharBall {
//   constructor(_x, _y, _c) {
//     this.x = _x;
//     this.y = _y;
//     this.ch = _c;
//     this.vx = random(-6, 6);
//     this.vy = random(-10, -18);
//     this.g = 0.8;
//     this.angle = 0;
//     this.size = 48;
//     this.isStopped = false;
//     this.phase = 0; 
//   }

//   display() {
//     push();
//     translate(this.x, this.y);
//     rotate(radians(this.angle));
//     fill('#FB8439'); 
//     noStroke();
//     textSize(this.size);
//     textAlign(CENTER, CENTER);
//     text(this.ch, 0, 0);
//     pop();
//   }

//   update(others) {
//     if (this.isStopped) return;

//     this.vy += this.g;
//     this.x += this.vx;
//     this.y += this.vy;
//     this.angle += 8;

//     if (this.phase === 0 && this.y > height + 50) {
//       this.phase = 1;
//       this.y = -50;
      
//       // 입구(중앙)를 피해서 떨어지도록 설정
//       if (random(1) > 0.5) {
//         this.x = random(50, width / 2 - 60);
//       } else {
//         this.x = random(width / 2 + 60, width - 50);
//       }
      
//       this.vy = 5;
//       this.vx = 0;
//     }

//     if (this.phase === 1 && this.vy > 0) {
//       if (this.y >= groundY) {
//         this.stopAt(groundY);
//       }

//       for (let other of others) {
//         if (other !== this && other.isStopped) {
//           let d = dist(this.x, this.y, other.x, other.y);
//           if (d < this.size * 0.8) {
//             this.stopAt(other.y - this.size * 0.7);
//           }
//         }
//       }
//     }
//   }

//   stopAt(newY) {
//     this.y = newY;
//     this.vy = 0;
//     this.vx = 0;
//     this.isStopped = true;
//     this.angle = random(-15, 15);
//   }
// }