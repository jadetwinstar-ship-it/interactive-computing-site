let vines = [];
const num = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  drawGrass();
  
  for (let i = vines.length - 1; i >= 0; i--) {
    let v = vines[i];
    v.update();
    v.display();
    
    if (v.isOut()) {
      vines.splice(i, 1);
    }
  }
}

function drawGrass() {
  fill('#D0FFC2');
  noStroke();

  const grassWidth = 160;
  const grassHeight = 110;
  const gapX = 60;
  const gapY = 20;
  
  for (let row = -1; row < height / (grassHeight + gapY) + 1; row++) {
    for (let col = -1; col < width / (grassWidth + gapX) + 2; col++) {
      let x = col * (grassWidth + gapX);
      let y = row * (grassHeight + gapY);
      
      if (row % 2 === 1) x += (grassWidth + gapX) / 2;
      
      drawGrassShape(x, y, grassWidth, grassHeight);
    }
  }
}

function drawGrassShape(x, y, w, h) {
  push();
  translate(x, y);
  
  const sx = w / 96;
  const sy = h / 51;
  
  beginShape();
  vertex(0, h);
  vertex(0, 15.4972 * sy);
  vertex(10.3784 * sx, 30.7127 * sy);
  vertex(20.7568 * sx, 8.73481 * sy);
  vertex(32.4324 * sx, 36.6298 * sy);
  vertex(44.1081 * sx, 2.81768 * sy);
  vertex(66.8108 * sx, 30.7127 * sy);
  vertex(84.3243 * sx, 0);
  vertex(84.3243 * sx, 30.7127 * sy);
  vertex(w, 15.4972 * sy);
  vertex(w, h);
  endShape(CLOSE);
  pop();
}

function mousePressed() {
  const numDirections = 6;
  const butsPerDirection = floor(num / numDirections);
  
  for (let d = 0; d < numDirections; d++) {
    const baseAngle = (PI / (numDirections - 1)) * d - PI; 
    for (let i = 0; i < butsPerDirection; i++) {
      const angle = baseAngle + random(-0.3, 0.3);
      const speed = random(1.5, 3.0);
      vines.push(new Vine(mouseX, mouseY, cos(angle) * speed, sin(angle) * speed));
    }
  }
}

class Vine {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 65;
    this.angle = 0;
    this.angleVel = random(0.1, 0.3);
    
    const colors = ['#FF6DEE', '#4C4CFC', '#27CB79', '#FFD900'];
    this.color = color(random(colors));
  }
  
  update() {
    this.size *= 0.992;
    this.dx += random(-0.2, 0.2);
    this.dy += random(-0.2, 0.2) + sin(this.angle) * 0.2;
    
    this.x += this.dx;
    this.y += this.dy;
    this.angle += this.angleVel;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(sin(this.angle) * 0.2);
    
    fill(this.color);
    noStroke();
    
    const w = this.size * 0.6;
    const h = this.size * 0.8;
    const s = this.size * 0.2;
    
    ellipse(-s, -s, w, h);
    ellipse(s, -s, w, h);
    ellipse(-s * 0.6, s, w * 0.7, h * 0.7);
    ellipse(s * 0.6, s, w * 0.7, h * 0.7);
    pop();
  }
  
  isOut() {
    return (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50 || this.size < 2);
  }
}