let y = 0;
let colors = ['#FCF480', '#D0E7F6', '#F3B69E', '#5A606F'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0);
  
  let colorProgress = (y * 0.5) % colors.length; 
  let index1 = floor(colorProgress);
  let index2 = (index1 + 1) % colors.length;
  let amt = colorProgress - index1;
  
  let baseColor = lerpColor(color(colors[index1]), color(colors[index2]), amt);

  for (let x = 0; x < width; x += 1) {
    let h = noise(x * 0.01, y);
    fill(baseColor);
    rect(x, 0, 1, h * 330);
  }

  let sunProgress = colorProgress / 3.0; 
  
  if (sunProgress > 1.0) {
    sunProgress = 1.1;
  }

  let sunX = map(sunProgress, 0, 1, -50, width + 50); 

  let parabola = -4 * pow(sunProgress - 0.5, 2) + 1; 
  let sunY = map(parabola, 0, 1, 200, 30);

  stroke(0);  
  strokeWeight(3); 
  
  let numRays = 7; 
  let startDist = 21;
  let endDist = 30;  

  for (let i = 0; i < numRays; i++) {
    let angle = map(i, 0, numRays, 0, TWO_PI);
    let x1 = sunX + cos(angle) * startDist;
    let y1 = sunY + sin(angle) * startDist;
    let x2 = sunX + cos(angle) * endDist;
    let y2 = sunY + sin(angle) * endDist;
    line(x1, y1, x2, y2);
  }
  
  noStroke(); 

  fill(0);
  circle(sunX, sunY, 30);

  y += 0.005;
  if (y > 1000) y = 0; 
}


// let y=0;
// // let t=0;
// // let from = '#032A10';
// // let to = '#EF476F';

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noStroke();
// }

// function draw() {
//   background(0);
// //   // noLoop();

// //   // fill(255);
// //   // noStroke();
// //   // for(let x=0; x<width; x+=4) {
// //   //   let h = random(100, 400);
// //   //   rect(x, 0, 4, h);
// //   // }

// //   //근데? 렌덤인데 약간 규칙이 있는 렌덤을 하고싶다 > noise로 한다 perlin noise

//   fill(255);
//   noStroke();
//   for(let x=0; x<width; x+=4) {
//     let h = noise(x*0.01, y);
//     rect(x, 0, 4, h*200);
//   }

//   y+= 0.005;
// }

// //noise는 항상 0~1 사이 값 > 곱해줌 수를
// // for(let x=0; x<width; x+=40) {
// //   for(let y=0; y<height; y+=40) {
// //     let n = noise(x*0.01, y*0.01, t);
// //     let c = lerpColor(color(from), color(to), n);
// //     let d = n * 40
// //     fill(c)
// //     ellipse(x, y, d);
// //   }
// // }

// // t += 0.1
// // }
