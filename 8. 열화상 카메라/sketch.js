let video;
let prevFrame;
let motionBuffer;

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(160, 120); 
  video.hide();
	
  prevFrame = createImage(160, 120);

  motionBuffer = createGraphics(width, height);
  motionBuffer.background(10, 10, 50);
}



function draw() {
  video.loadPixels();
  prevFrame.loadPixels();

  motionBuffer.noStroke();
  motionBuffer.fill(10, 10, 50, 20); 
  motionBuffer.rect(0, 0, width, height);

  let scaleX = width / video.width;
  let scaleY = height / video.height;

  for (let x = 0; x < video.width; x++) {
    for (let y = 0; y < video.height; y++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let pr = prevFrame.pixels[index];
      let pg = prevFrame.pixels[index + 1];
      let pb = prevFrame.pixels[index + 2];
      let diff = dist(r, g, b, pr, pg, pb);

      if (diff > 80) { 
        let screenX = x * scaleX;
        let screenY = y * scaleY;
        let d = dist(screenX, screenY, width / 2, height / 2);
        let col = getThermalColor(d);

        motionBuffer.fill(red(col), green(col), blue(col), 150);
        motionBuffer.ellipse(screenX, screenY, scaleX * 1.8, scaleY * 1.8);
      }
    }
  }
	
  image(motionBuffer, 0, 0);
  filter(BLUR, 1.5); 
  prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  motionBuffer.resizeCanvas(windowWidth, windowHeight);
}

function getThermalColor(d) {
  let maxD = dist(0, 0, width / 2, height / 2);
  let pct = map(d, 0, maxD, 0, 1);
  let c1 = color(255, 255, 0);   
  let c2 = color(255, 50, 0);  
  let c3 = color(180, 0, 180);  
  let c4 = color(10, 10, 50);    

  if (pct < 0.2) return lerpColor(c1, c2, pct / 0.2);
  if (pct < 0.6) return lerpColor(c2, c3, (pct - 0.2) / 0.4);
  return lerpColor(c3, c4, (pct - 0.6) / 0.4);
}