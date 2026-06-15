// let x=200;
// let y=200;
// let startX = 200;
// let targetX = 800;
// let incr = 8;
// let dir = 1;
// let steps = 0;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   rectMode(CENTER);
// }

// //쓰고 싶은 이징 코드를 써줌
// function easeOutCirc(x) { //0~1사이의 숫자를 넣어야함
//   return Math.sqrt( 1- Math.pow(x - 1, 2));
// }

// function draw() {
//   background(0);

//   rect(x, y, 100);

//   steps = frameCount % 100;
// // 0~1사이의 값으로 1~100 프레임을 표현하는 거임.100프레임씩 표현 그걸 이징 펑션에 집어넣고 그게 다시 위치로 나오는 거. ex 0.45넣음 > 이징 펑션에 넣으면 72%가 나올 수 있음. 같은 값이 나오는게 아님
// // 이징된 상대 위치
// // 0~1 사이의 값으로 바꿔주는 거 > normalize

// let n = norm(steps, 0, 100); //여기서 나온 n 값을 이징펑션에 넣는 거. 프레임 값을 노말라이즈 함 0~1값
// let amt = easeOutCirc(n); //v라는 값 > 처음에 설정한 200-800사이 위치 값으로 > lerp 펑션으로 바꿔줌
// x = lerp(startX, targetX, amt);
  

// }


// let x=200;
// let y=200;
// let startX = 200;
// let targetX = 800;
// let incr = 8;
// let dir = 1;
// let steps = 0;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   rectMode(CENTER);
// }

// //쓰고 싶은 이징 코드를 써줌
// function easeInOutExpo(x) {
// return x === 0
//   ? 0
//   : x === 1
//   ? 1
//   : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
//   : (2 - Math.pow(2, -20 * x + 10)) / 2;
// }

// function draw() {
//   background(0);

//   rect(x, y, 100);

//   steps = frameCount % 200;
// // 0~1사이의 값으로 1~100 프레임을 표현하는 거임.100프레임씩 표현 그걸 이징 펑션에 집어넣고 그게 다시 위치로 나오는 거. ex 0.45넣음 > 이징 펑션에 넣으면 72%가 나올 수 있음. 같은 값이 나오는게 아님
// // 이징된 상대 위치
// // 0~1 사이의 값으로 바꿔주는 거 >
// //  normalize

// if (steps >= 0 && steps < 100) {
//   let n = norm(steps, 0, 100);
//   let amt = easeInOutExpo(n);
//   x = lerp(startX, targetX, amt);
// } else {
//   let n = norm(steps, 100, 200);
//   let amt = easeInOutExpo(n);
//   x = lerp(targetX, startX, amt);
// } 

// }


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
}

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  if (x === 0) return 0;
  if (x === 1) return 1;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 0.5) / 2;
}

const STAR_PERIOD = 5.0;
const DROP_PERIOD = 2;

function draw() {
  background('#535561');
  noStroke();

  let elapsed = millis() / 1000;

  let dropPhase = (elapsed % DROP_PERIOD) / DROP_PERIOD;
  let dropT = dropPhase < 0.5 ? dropPhase * 2 : (1 - dropPhase) * 2;
  let eased = easeInOutSine(dropT);
  let dropScale = 0.3 + eased * 0.5;

  let r = lerp(0xED, 0xFF, eased);
  let g = lerp(0xEB, 0xAF, eased);
  let b = lerp(0xEE, 0xE5, eased);
  fill(r, g, b);

  for (let x = 0; x < width + 1000; x += 100) {
    for (let y = 0; y < height + 1000; y += 100) {
      push();
      translate(x, y);
      scale(dropScale);
      beginShape();
      vertex(-68, -113);
      bezierVertex(-68, -50, -32, -40, -32, 0);
      bezierVertex(-32, 40, -68, 50, -68, 113);
      vertex(68, 113);
      bezierVertex(68, 50, 32, 40, 32, 0);
      bezierVertex(32, -40, 68, -50, 68, -113);
      vertex(-68, -113);
      endShape();
      pop();
    }
  }

  let starPhase = (elapsed % STAR_PERIOD) / STAR_PERIOD;
  let starAngle = easeOutElastic(starPhase) * TWO_PI;

  fill('#ED51A3');
  for (let x = 0; x < width + 1000; x += 200) {
    for (let y = 0; y < height + 1000; y += 150) {
      push();
      translate(x, y);
      scale(0.55);
      rotate(starAngle);
      beginShape();
      vertex(35.1, -172.9);
      vertex(-27.3, -44.2);
      vertex(-171.6, -44.2);
      vertex(-217.1, 44.2);
      vertex(-71.5, 44.2);
      vertex(-136.5, 172.9);
      vertex(-36.4, 172.9);
      vertex(26.0, 44.2);
      vertex(170.3, 44.2);
      vertex(215.8, -44.2);
      vertex(70.2, -44.2);
      vertex(135.2, -174.2);
      endShape();
      pop();
    }
  }
}