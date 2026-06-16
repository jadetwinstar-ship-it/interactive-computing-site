let faceMesh, video, faces = [];
const faceOptions = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

let eyeImg, noseImg, mouthImg, jumpIconImg, pixelFont;
let eyePink, nosePink, mouthPink;

let gameState = 'start'; // 'start' | 'playing' | 'gameover'

let playerX, playerY, playerVY;
let isJumping = false;
let jumpH = 0;        
let groundY, charW, charH;

let obstacles = [];
let obstacleTimer = 0;
let nextObstacleTime = 150;
let gameSpeed = 14;

let gameStartTime = 0;
let elapsedSeconds = 0;
let blinkCount = 0;

let prevEyeOpen = true;
let blinkCooldown = 0;

const PINK       = [246, 130, 180]; 
const PINK_LIGHT = [255, 185, 210]; 
const PINK_DEEP  = [210,  70, 130]; 
const BG_DARK    = [ 86,  82,  82]; 
const BG_LIGHT   = [210, 206, 202]; 
const CHAR_DARK  = [ 50,  50,  50]; 

function preload() {
  faceMesh    = ml5.faceMesh(faceOptions);
  eyeImg      = loadImage('눈.png');
  noseImg     = loadImage('코.png');
  mouthImg    = loadImage('입.png');
  jumpIconImg = loadImage('Group 7.png');
  pixelFont   = loadFont('GalmuriMono9.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  textFont(pixelFont);
  noSmooth();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);

  eyePink   = recolor(eyeImg,  false);
  nosePink  = recolor(noseImg, true);
  mouthPink = recolor(mouthImg, true);

  calcSizes();
}

function recolor(src, twoTone) {
  let g = createGraphics(src.width, src.height);
  g.pixelDensity(1);
  g.noSmooth();
  g.image(src, 0, 0);
  g.loadPixels();
  let px = g.pixels;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 10) continue;
    let br = (px[i] + px[i+1] + px[i+2]) / 3;
    if (br > 220) continue; // 흰색 유지
    if (twoTone && br > 80) {
      // 중간 회색 → 연핑크
      px[i] = PINK_LIGHT[0]; px[i+1] = PINK_LIGHT[1]; px[i+2] = PINK_LIGHT[2];
    } else {
      // 어두운 → 기본 핑크
      px[i] = PINK[0]; px[i+1] = PINK[1]; px[i+2] = PINK[2];
    }
  }
  g.updatePixels();
  return g;
}

function calcSizes() {
  groundY = height * 0.78;
  charW   = width  * 0.072;
  charH   = charW  * (eyeImg.height / eyeImg.width); // 실제 비율 유지
  playerX = width  * 0.20;
}

function resetGame() {
  playerY          = groundY;
  playerVY         = 0;
  isJumping        = false;
  jumpH            = 0;
  obstacles        = [];
  obstacleTimer    = 0;
  nextObstacleTime = int(random(20, 35));  // ~0.5초 후 첫 스폰 (3초 내 눈 앞 도달)
  gameSpeed        = width * 0.009;
  blinkCount       = 0;
  elapsedSeconds   = 0;
  gameStartTime    = millis();
  prevEyeOpen      = true;
  blinkCooldown    = 0;
}

function draw() {
  processBlink();
  if      (gameState === 'start')    drawStart();
  else if (gameState === 'playing')  drawGame();
  else if (gameState === 'gameover') drawGameOver();
}

function processBlink() {
  if (faces.length === 0) return;
  let face = faces[0];
  let leftEAR  = face.leftEye.height  / face.leftEye.width;
  let rightEAR = face.rightEye.height / face.rightEye.width;
  let ear      = (leftEAR + rightEAR) / 2;

  if (blinkCooldown > 0) blinkCooldown--;
  let closed = ear < 0.18;

  if (closed && prevEyeOpen && blinkCooldown === 0) {
    if (gameState === 'playing' && !isJumping) {
      triggerJump();
    }
  }
  prevEyeOpen = !closed;
}

function triggerJump() {
  isJumping  = true;
  playerVY   = -height * 0.040;
  blinkCount++;
  blinkCooldown = 30;
}

function drawStart() {
  background(...BG_DARK);
  textFont(pixelFont);

  let cx  = width  / 2;
  let mcy = height * 0.38;
  let sz  = width  * 0.080;

  let lx  = cx - width * 0.18;
  let eyW = sz;
  let eyH = eyW * (eyeImg.height / eyeImg.width);
  image(eyePink, lx - eyW * 0.5, mcy - eyH * 0.5, eyW, eyH);

  let rx  = cx + width * 0.18;
  let g7W = sz * 1.05;
  let g7H = g7W * (jumpIconImg.height / jumpIconImg.width);
  image(jumpIconImg, rx - g7W * 0.5, mcy - g7H * 0.55, g7W, g7H);

  noStroke();
  fill(...PINK);
  textSize(width * 0.036);
  let iconBottom = mcy + max(eyH, g7H) * 0.5;
  let labelY     = iconBottom + height * 0.035;
  textAlign(CENTER, TOP);
  text('Blink', lx, labelY);
  text('Jump',  rx, labelY);

  textAlign(CENTER, CENTER);
  textSize(width * 0.026);
  text('> > > > >', cx, mcy);

  let bw  = width  * 0.24;
  let bh  = height * 0.088;
  let bx  = cx - bw / 2;
  let by  = height * 0.63;
  let hov = mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;

  stroke(...PINK);
  strokeWeight(max(2, width * 0.002));
  fill(hov ? [...PINK] : [...BG_DARK]);
  rect(bx, by, bw, bh);
  noStroke();
  fill(hov ? [...BG_DARK] : [...PINK]);
  textSize(width * 0.026);
  text('Click to Play', cx, by + bh / 2);

  textAlign(LEFT, BASELINE);
}

function drawGame() {
  background(...BG_LIGHT);

  elapsedSeconds = floor((millis() - gameStartTime) / 1000);
  gameSpeed = width * 0.009 + elapsedSeconds * width * 0.000118;

  stroke(...PINK);
  strokeWeight(max(2, width * 0.002));
  line(0, groundY, width, groundY);

  noStroke();
  fill(...PINK);
  textAlign(LEFT, TOP);
  textSize(width * 0.042);
  text(elapsedSeconds + 's', width * 0.03, max(height * 0.04, 120));

  updateObstacles();

  if (isJumping) {
    playerVY += height * 0.0016;  // 중력
    playerY  += playerVY;
    jumpH     = groundY - playerY;
    if (playerY >= groundY) {
      playerY   = groundY;
      playerVY  = 0;
      isJumping = false;
      jumpH     = 0;
    }
  }

  drawPlayer();
  checkCollision();
  textAlign(LEFT, BASELINE);
}

function drawPlayer() {
  let bx = playerX - charW / 2;

  if (!isJumping) {
    image(eyeImg, bx, playerY - charH, charW, charH);
    return;
  }

  let stage = (jumpH > charH * 1.8) ? 2 : 1;
  drawSquishEye(bx, stage);
}

function drawSquishEye(bx, stage) {
  noStroke();

  if (stage === 1) {
    let by = playerY - charH;

    fill(...CHAR_DARK);
    rect(bx, by, charW, charH * 0.82);

    rect(bx + charW * 0.10, by + charH * 0.82, charW * 0.20, charH * 0.18);
    rect(bx + charW * 0.54, by + charH * 0.82, charW * 0.20, charH * 0.18);

    let ewW      = charW * 0.32;
    let ewHfull  = charH * 0.36; 
    let ewH      = ewHfull * 0.48; 
    let ewBaseY  = by + charH * 0.16;
    let ewY      = ewBaseY + (ewHfull - ewH) / 2;

    fill(...BG_LIGHT);
    rect(bx + charW * 0.09, ewY, ewW, ewH);
    rect(bx + charW * 0.57, ewY, ewW, ewH);

  } else {
    let flatH = charH * 0.36;
    let by    = playerY - flatH; // 바닥 고정

    fill(...CHAR_DARK);
    rect(bx, by, charW, flatH);
  }
}

function updateObstacles() {
  obstacleTimer++;
  if (obstacleTimer >= nextObstacleTime) {
    obstacleTimer    = 0;
    let pxGap        = random(width * 1.05, width * 1.55);
    nextObstacleTime = ceil(pxGap / gameSpeed);
    let type  = int(random(2));
    let obsW  = type === 0 ? charW * 0.70 : charW * 1.05;
    let obsH  = type === 0 ? charH * 0.65 : charH * 0.48;
    obstacles.push({ x: width + obsW, w: obsW, h: obsH, type });
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];
    ob.x -= gameSpeed;
    let ox = ob.x - ob.w / 2;
    let oy = groundY - ob.h;
    if (ob.type === 0) image(noseImg,  ox, oy, ob.w, ob.h);
    else               image(mouthImg, ox, oy, ob.w, ob.h);
    if (ob.x + ob.w < 0) obstacles.splice(i, 1);
  }
}

function checkCollision() {
  let hx = playerX - charW * 0.28;
  let hy = playerY  - charH * 0.86;
  let hw = charW * 0.56;
  let hh = charH * 0.83;
  for (let ob of obstacles) {
    let ox = ob.x - ob.w * 0.50;
    let oy = groundY  - ob.h * 0.92;
    let ow = ob.w * 1.00;
    let oh = ob.h * 0.92;
    if (hx < ox + ow && hx + hw > ox && hy < oy + oh && hy + hh > oy) {
      gameState = 'gameover';
    }
  }
}

function drawGameOver() {
  background(...BG_DARK);
  let cx = width / 2;

  noStroke();
  fill(...PINK);
  textAlign(CENTER, CENTER);
  textSize(width * 0.024);
  text('Game Over', cx, height * 0.25);

  textSize(width * 0.038);
  let pre  = 'You Blinked ';
  let num  = str(blinkCount);
  let post = ' Times.';
  let ty   = height * 0.35;
  fill(...PINK);
  text(pre + num + post, cx, ty);
  fill(...PINK_DEEP);
  let fw  = textWidth(pre + num + post);
  let pw  = textWidth(pre);
  let nw  = textWidth(num);
  text(num, cx - fw / 2 + pw + nw / 2, ty);

  let eyW  = width * 0.04;
  let eyH  = eyW  * (eyeImg.height  / eyeImg.width);
  let nsW  = width * 0.029;
  let nsH  = nsW  * (noseImg.height  / noseImg.width);
  let mtW  = width * 0.037;
  let mtH  = mtW  * (mouthImg.height / mouthImg.width);
  let gap  = height * 0.025;

  let totalStackH = eyH + nsH + mtH + gap * 2;
  let stackTop    = height * 0.52;

  let eyY  = stackTop;
  let nsY  = eyY  + eyH  + gap;
  let mtY  = nsY  + nsH  + gap;

  image(eyePink,   cx - eyW / 2, eyY,  eyW,  eyH);
  image(nosePink,  cx - nsW / 2, nsY,  nsW,  nsH);
  image(mouthPink, cx - mtW / 2, mtY,  mtW,  mtH);

  let rw  = width  * 0.20;
  let rh  = height * 0.085;
  let rx  = cx - rw / 2;
  let ry  = mtY + mtH + height * 0.04;
  let hov = mouseX > rx && mouseX < rx + rw && mouseY > ry && mouseY < ry + rh;

  stroke(...PINK);
  strokeWeight(max(2, width * 0.002));
  fill(hov ? [...PINK] : [...BG_DARK]);
  rect(rx, ry, rw, rh);
  noStroke();
  fill(hov ? [...BG_DARK] : [...PINK]);
  textSize(width * 0.026);
  text('Replay', cx, ry + rh / 2);

  textAlign(LEFT, BASELINE);
}

function mouseClicked() {
  if (gameState === 'start') {
    let bw = width  * 0.24;
    let bh = height * 0.088;
    let bx = width / 2 - bw / 2;
    let by = height * 0.63;
    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
      gameState = 'playing';
      resetGame();
    }
  } else if (gameState === 'gameover') {
    let eyH = (width * 0.04)  * (eyeImg.height  / eyeImg.width);
    let nsH = (width * 0.029) * (noseImg.height  / noseImg.width);
    let mtH = (width * 0.037) * (mouthImg.height / mouthImg.width);
    let gap = height * 0.025;
    let mtY = height * 0.52 + eyH + gap + nsH + gap;
    let rw  = width  * 0.20;
    let rh  = height * 0.085;
    let rx  = width / 2 - rw / 2;
    let ry  = mtY + mtH + height * 0.04;
    if (mouseX > rx && mouseX < rx + rw && mouseY > ry && mouseY < ry + rh) {
      gameState = 'playing';
      resetGame();
    }
  }
}

function keyPressed() {
  if ((key === ' ') && gameState === 'playing' && !isJumping) {
    triggerJump();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcSizes();
}

function gotFaces(results) {
  faces = results;
}