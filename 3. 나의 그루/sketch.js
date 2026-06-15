// let x, y;
let rad1 = 0,
	rad2 = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// x = width/2;
	// y = height/2;
}

function draw() {
	background('#161F0E');
	noStroke();

	for (let x = 0; x < width + 1000; x += 100) {
		for (let y = 0; y < height + 1000; y += 100) {
			push();
			translate(x, y);
			scale(0.5);
			rotate(rad2);
			fill('#EF43A4');
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

	for (let x = 0; x < width + 1000; x += 200) {
		for (let y = 0; y < height + 1000; y += 150) {
			push();
			translate(x, y);
			scale(0.55);
			rotate(rad1);
			fill('#C4FA00');
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

	rad1 += PI / 360;
	rad2 -= PI / 180;
}