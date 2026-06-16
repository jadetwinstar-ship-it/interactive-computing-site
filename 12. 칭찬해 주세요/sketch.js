let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/VJcVJqutc/';

let video;
let label = "none";

// Growth: 0=2down, 1=down, 2=normal, 3=up, 4=2up
let targetGrowth = 2;
let currentGrowth = 2;

// Layout
let PS, CX, HILL_Y;
let VIDEO_W, VIDEO_H, VIDEO_X, VIDEO_Y, LABEL_H;
let SW, MAX_STEM, TEXT_BOTTOM_Y;
let cnv; // canvas reference for container-size detection

// ── Color palette (sketch-inspired) ─────────────────────────────
const C_STEM      = [95, 185, 55];    // main stem green
const C_STEM_SH   = [58, 128, 32];    // stem shadow
const C_LEAF      = [125, 205, 60];   // leaf (lighter)
const C_LEAF_SH   = [68, 140, 30];    // leaf shadow / tip
const C_PETAL     = [215, 55, 165];   // main magenta petal
const C_PETAL_LT  = [228, 88, 192];   // lighter magenta (cool, not warm)
const C_PETAL_DK  = [152, 18, 108];   // dark petal outer tip
const C_CENTER    = [145, 215, 48];   // lime green flower center
const C_CENTER_DK = [88, 148, 22];    // dark center dot
const C_BROWN     = [148, 102, 52];   // dead stem
const C_TAN       = [188, 148, 82];   // dead tip/leaf
const C_YELLOW    = [255, 215, 50];
const C_GOLD      = [212, 158, 20];

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', { flipped: true });
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  noSmooth();
  fitCanvas(); // resize to actual container (fixes OpenProcessing offset)
  computeLayout();
  video = createCapture(VIDEO);
  video.size(VIDEO_W, VIDEO_H);
  video.hide();
  classifyVideo();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fitCanvas();
  computeLayout();
  video.size(VIDEO_W, VIDEO_H);
}

// Read the canvas's actual container size and resize to fit it
function fitCanvas() {
  let parent = cnv.elt.parentElement;
  if (!parent) return;
  let pw = parent.clientWidth;
  let ph = parent.clientHeight;
  if (pw > 0 && ph > 0 && (pw !== width || ph !== height)) {
    resizeCanvas(pw, ph);
  }
}

function computeLayout() {
  // Use canvas width/height (set by createCanvas/resizeCanvas), not windowWidth/Height
  // This ensures correct centering in OpenProcessing and other embedded environments
  let W = width, H = height;

  PS     = max(6, floor(min(W, H) / 58));
  if (PS % 2 !== 0) PS++;
  CX     = floor(W / 2);
  HILL_Y = floor(H * 0.80);
  SW     = max(1.5, W * 0.0018);

  let fs = max(13, W * 0.018);
  TEXT_BOTTOM_Y = max(H * 0.09, 130) + fs * 1.6;

  let plantCeiling = TEXT_BOTTOM_Y + H * 0.12;
  MAX_STEM = max(4, floor((hillPeakY() - plantCeiling) / PS));

  VIDEO_W = floor(W * 0.13 / 2) * 2;
  VIDEO_H = floor(VIDEO_W * 0.65);
  LABEL_H = floor(VIDEO_H * 0.22);
  VIDEO_X = CX - VIDEO_W / 2;
  VIDEO_Y = floor(HILL_Y + (H - HILL_Y - VIDEO_H - LABEL_H) * 0.25 - H * 0.01);
}

// ── Draw ──────────────────────────────────────────────────────────

function draw() {
  background(18);
  currentGrowth = lerp(currentGrowth, targetGrowth, 0.035);

  drawInstructionText();
  drawPlant(currentGrowth);
  drawHill(currentGrowth);
  drawFallenElements(currentGrowth); // on top of hill
  drawVideoBox();
}

// ── Instruction text ──────────────────────────────────────────────

function drawInstructionText() {
  let ty = max(height * 0.09, 130);
  let fs = max(13, width * 0.018);
  let prefix  = "Make  ";
  let gesture = "2 thumbs up/ thumb up/ thumb down/ 2 thumbs down";
  let line1   = prefix + gesture;

  textSize(fs);
  textAlign(LEFT, BASELINE);
  noStroke();
  let totalW  = textWidth(line1);
  let startX  = CX - totalW / 2;

  fill(240);
  text(prefix, startX, ty);
  fill(C_PETAL[0], C_PETAL[1], C_PETAL[2]);
  text(gesture, startX + textWidth(prefix), ty);

  textSize(fs * 0.85);
  textAlign(CENTER, BASELINE);
  fill(240);
  text("(Close to Camera)", CX, ty + fs * 1.3);

  textSize(fs);
  stroke(240); strokeWeight(SW * 0.8);
  line(CX - totalW / 2, ty + fs * 0.4, CX + totalW / 2, ty + fs * 0.4);
}

// ── Hill (pixel art mound) ────────────────────────────────────────

function drawHill(g) {
  let hillW = floor(width * 0.36 / PS);
  let drop  = 4;
  // g=0 → brown, g=1 → normal green
  let t = constrain(g, 0, 1);
  let col = lerpC(C_BROWN, [90, 185, 55], t);
  noStroke();
  for (let gx = -(hillW - 1); gx <= hillW - 1; gx++) {
    let frac = (gx / hillW) * (gx / hillW);
    let topY = hillPeakY() + floor(frac * drop) * PS;
    fill(col[0], col[1], col[2]);
    rect(CX + gx * PS - PS / 2, topY, PS, PS);
  }
}

// ── Video box ─────────────────────────────────────────────────────

function drawVideoBox() {
  let x = VIDEO_X, y = VIDEO_Y, w = VIDEO_W, h = VIDEO_H, lh = LABEL_H;
  image(video, x, y, w, h);
  stroke(220); strokeWeight(SW * 1.2); noFill();
  rect(x, y, w, h + lh);
  line(x, y + h, x + w, y + h);
  fill(200); noStroke();
  textAlign(CENTER, CENTER);
  textSize(max(11, w * 0.09));
  text(label, x + w / 2, y + h + lh / 2);
}

// ── Pixel art helpers ─────────────────────────────────────────────

function hillPeakY() { return floor(HILL_Y - height * 0.055); }

// Draw one pixel-art cell. gy=0 is hill surface, positive = up.
// Pixel center at (CX + gx*PS, hillPeakY - gy*PS)
function px(gx, gy, col, op) {
  let screenX = CX + gx * PS - PS / 2;
  let screenY = hillPeakY() - gy * PS;
  if (screenY + PS > HILL_Y + 2) return;
  let a = constrain(op === undefined ? 1 : op, 0, 1) * 255;
  fill(col[0], col[1], col[2], a);
  noStroke();
  rect(screenX, screenY, PS, PS);
}

function lerpC(a, b, t) {
  t = constrain(t, 0, 1);
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

// ── Plant ─────────────────────────────────────────────────────────

function drawPlant(g) {
  if (g < 0.4) {
    drawDeadPlant(1);
  } else if (g < 1) {
    let t = map(g, 0.4, 1, 0, 1);
    drawDeadPlant(1 - t);
    drawAlivePlant(g, t);
  } else {
    drawAlivePlant(g, 1);
  }

  if (g > 3.2) {
    let t = constrain(map(g, 3.2, 4, 0, 1), 0, 1);
    drawSprout(-9, t);
    drawSprout(9, t);
  }
  if (g > 3.5) drawSun(constrain(map(g, 3.5, 4, 0, 1), 0, 1));
}

// Dead wilted plant
function drawDeadPlant(op) {
  if (op <= 0) return;
  for (let i = 0; i < 5; i++) {
    px(i + 1, 1 + (i > 3 ? -1 : 0), lerpC(C_BROWN, C_TAN, i / 4), op);
  }
  px(5, 2, C_TAN, op);
  px(2, 2, C_TAN, op * 0.6);
  px(4, 0, C_TAN, op * 0.6);
}

// Living plant
function drawAlivePlant(g, op) {
  let stemH  = constrain(map(g, 1, 4, 5, MAX_STEM), 5, MAX_STEM);
  let stemHi = floor(stemH);
  let stemFr = stemH - stemHi;

  // Stem — main + shadow on alternating cells
  for (let gy = 1; gy <= stemHi; gy++) {
    let f = (gy === stemHi) ? stemFr : 1;
    px(0, gy, C_STEM, op * f);
    if (gy % 3 === 0) px(0, gy, C_STEM_SH, op * 0.4 * f); // shadow accent
  }

  let topY = stemHi + 1;

  // Leaf pairs
  if (g > 1.5) {
    let lt = constrain(map(g, 1.5, 2.2, 0, 1), 0, 1);
    drawLeafPair(1 + floor(stemH * 0.35), 2, lt * op);
  }
  if (g > 2.5) {
    let lt = constrain(map(g, 2.5, 3.2, 0, 1), 0, 1);
    drawLeafPair(1 + floor(stemH * 0.60), 2, lt * op);
  }
  if (g > 3.5) {
    let lt = constrain(map(g, 3.5, 4, 0, 1), 0, 1);
    drawLeafPair(1 + floor(stemH * 0.80), 2, lt * op);
  }

  let flowerSize = constrain(map(g, 1, 4, 1, 5), 1, 5);
  drawFlower(topY, flowerSize, op);
}

function drawLeafPair(ly, llen, op) {
  for (let i = 1; i <= llen; i++) {
    let oy = floor(i * 0.5);
    px(-i, ly + oy, C_LEAF,    op);
    px( i, ly + oy, C_LEAF,    op);
  }
  // Shadow tip
  px(-llen, ly + floor(llen * 0.5), C_LEAF_SH, op * 0.7);
  px( llen, ly + floor(llen * 0.5), C_LEAF_SH, op * 0.7);
}

function drawFlower(fy, size, op) {
  // Cardinals (N/S/E/W) — lighter pink inner
  let p1 = constrain(map(size, 0.5, 1.5, 0, 1), 0, 1);
  if (p1 > 0) {
    px( 0, fy+1, C_PETAL_LT, op*p1);
    px( 0, fy-1, C_PETAL_LT, op*p1);
    px(-1, fy,   C_PETAL_LT, op*p1);
    px( 1, fy,   C_PETAL_LT, op*p1);
  }
  // Diagonals — main magenta
  let p2 = constrain(map(size, 1.5, 2.5, 0, 1), 0, 1);
  if (p2 > 0) {
    px(-1, fy+1, C_PETAL, op*p2);
    px( 1, fy+1, C_PETAL, op*p2);
    px(-1, fy-1, C_PETAL, op*p2);
    px( 1, fy-1, C_PETAL, op*p2);
  }
  // Extended cardinals — main magenta
  let p3 = constrain(map(size, 2.5, 3.5, 0, 1), 0, 1);
  if (p3 > 0) {
    px( 0, fy+2, C_PETAL,    op*p3);
    px( 0, fy-2, C_PETAL,    op*p3);
    px(-2, fy,   C_PETAL,    op*p3);
    px( 2, fy,   C_PETAL,    op*p3);
    px(-2, fy+1, C_PETAL,    op*p3*0.7);
    px( 2, fy+1, C_PETAL,    op*p3*0.7);
    px(-2, fy-1, C_PETAL,    op*p3*0.7);
    px( 2, fy-1, C_PETAL,    op*p3*0.7);
  }
  // Outer tips — darkest
  let p4 = constrain(map(size, 3.5, 5, 0, 1), 0, 1);
  if (p4 > 0) {
    px(-2, fy+2, C_PETAL_DK, op*p4*0.9);
    px( 2, fy+2, C_PETAL_DK, op*p4*0.9);
    px(-2, fy-2, C_PETAL_DK, op*p4*0.9);
    px( 2, fy-2, C_PETAL_DK, op*p4*0.9);
    px( 0, fy+3, C_PETAL_DK, op*p4*0.7);
    px( 0, fy-3, C_PETAL_DK, op*p4*0.7);
    px(-3, fy,   C_PETAL_DK, op*p4*0.7);
    px( 3, fy,   C_PETAL_DK, op*p4*0.7);
  }

  // Lime green center (appears from size 1)
  let cOp = constrain(map(size, 0.8, 1.5, 0, 1), 0, 1);
  if (cOp > 0) {
    px( 0, fy, C_CENTER,    op * cOp);
    // Expand center from size 2
    let cBig = constrain(map(size, 2, 3, 0, 1), 0, 1);
    if (cBig > 0) {
      px( 1, fy, C_CENTER, op * cBig * 0.85);
      px(-1, fy, C_CENTER, op * cBig * 0.85);
      px( 0, fy+1, C_CENTER, op * cBig * 0.85);
      px( 0, fy-1, C_CENTER, op * cBig * 0.85);
    }
    // Dark center dot
    px(0, fy, C_CENTER_DK, op * cOp);
  }
}

// Fallen petals & leaves — scattered just above the hill line near the base
function drawFallenElements(g) {
  if (g < 0.5 || g > 1.8) return;
  let op = g < 1
    ? constrain(map(g, 0.5, 1.0, 0, 1), 0, 1)
    : constrain(map(g, 1.0, 1.8, 1, 0), 0, 1);

  // Fallen petals — above hill surface (gy 1~2), spread horizontally
  px(-4, 1, C_PETAL,    op * 0.95);
  px( 3, 1, C_PETAL,    op * 0.85);
  px(-3, 2, C_PETAL_DK, op * 0.55);
  px( 7, 1, C_PETAL,    op * 0.50);

  // Fallen leaves
  px(-2, 1, C_LEAF,    op * 0.85);
  px( 4, 2, C_LEAF_SH, op * 0.70);
}

function drawSprout(gx, op) {
  if (op <= 0) return;
  px(gx,   1, C_STEM,    op);
  px(gx,   2, C_STEM,    op);
  px(gx-1, 2, C_LEAF,    op * 0.85);
  px(gx+1, 2, C_LEAF,    op * 0.85);
  px(gx,   3, C_PETAL,   op * 0.9);
}

function drawSun(op) {
  if (op <= 0) return;
  let ox = floor(width  * 0.74 / PS) * PS;
  let oy = floor((TEXT_BOTTOM_Y + height * 0.06) / PS) * PS;

  function sp(dx, dy, col) {
    fill(col[0], col[1], col[2], op * 255);
    noStroke();
    rect(ox + dx * PS, oy + dy * PS, PS, PS);
  }

  let rays = [[0,-3],[0,3],[-3,0],[3,0],[-2,-2],[2,-2],[-2,2],[2,2]];
  for (let r of rays) sp(r[0], r[1], C_GOLD);

  for (let d = -2; d <= 2; d++) { sp(d, 0, C_YELLOW); sp(0, d, C_YELLOW); }
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      sp(dx, dy, C_YELLOW);

  sp(0, 0, C_GOLD);
}

// ── ML5 ──────────────────────────────────────────────────────────

function classifyVideo() {
  classifier.classifyStart(video, gotResult);
}

function gotResult(results) {
  if (!results || results.length === 0) return;
  label = results[0].label;
  console.log(label);

  if      (label === "2 thumbs up")   targetGrowth = 4;
  else if (label === "thumb up")      targetGrowth = 3;
  else if (label === "none")          targetGrowth = 2;
  else if (label === "thumb down")    targetGrowth = 1;
  else if (label === "2 thumbs down") targetGrowth = 0;
}
