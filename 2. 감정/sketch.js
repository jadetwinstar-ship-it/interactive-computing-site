function setup() {
  createCanvas(1200, 1200);
}

function draw() {
  background(255);

  fill(227, 227, 227, 50);
  stroke(0);
  strokeWeight(1);
  ellipse(65+465/2, 640+465/2, 465);
  fill(227, 227, 227, 80);
  stroke(0);
  strokeWeight(1);
  ellipse(80+435/2, 655+435/2, 435);
  fill(227, 227, 227, 120);
  stroke(0);
  strokeWeight(1.5);
  ellipse(102+391/2, 677+391/2, 391);
  fill(227, 227, 227, 180);
  stroke(0);
  strokeWeight(2);
  ellipse(138+319/2, 713+319/2, 319);

  let gradient6 = drawingContext.createRadialGradient(278+39/2, 853+39/2, 0, 278+39/2, 853+39/2, 39/2);
  gradient6.addColorStop(0, '#FFFFFF');
  gradient6.addColorStop(1, '#000000');

  drawingContext.fillStyle = gradient6;
  ellipse(278+39/2, 853+39/2, 39);

  noStroke();
  fill('#FF6404');
  beginShape();
  vertex(957, 552);
  vertex(859, 775);
  vertex(715, 734);
  vertex(817, 829);
  vertex(700, 1036);
  vertex(859, 971);
  vertex(944, 1126);
  vertex(978, 983);
  vertex(1164, 930);
  vertex(1005, 847);
  vertex(1062, 725);
  vertex(978, 750);
  endShape();

  stroke('#EF1B1B');
  strokeWeight(5);
  fill(255);
  beginShape();
  vertex(886, 556);
  vertex(873, 813);
  vertex(760, 679);
  vertex(817, 829);
  vertex(683, 853);
  vertex(829, 890);
  vertex(646, 1034);
  vertex(873, 926);
  vertex(886, 1137);
  vertex(962, 926);
  vertex(1082, 990);
  vertex(969, 837);
  vertex(1101, 740);
  vertex(921, 797);
  vertex(886, 556);
  endShape();

  noStroke();

  let gradient1 = drawingContext.createLinearGradient(0, 233, 600, 233);
  gradient1.addColorStop(0, '#FFDD00');
  gradient1.addColorStop(1, '#FFFADD');

  drawingContext.fillStyle = gradient1;
  rect(0, 203, 899, 60); 

  let gradient2 = drawingContext.createLinearGradient(733+45, 30, 733+45, 233, 323+90/2);
  gradient2.addColorStop(0.5, '#FFDD00');
  gradient2.addColorStop(1, '#FFF199');

  drawingContext.fillStyle = gradient2;
  rect(733, -144, 90, 513);

  let gradient3 = drawingContext.createLinearGradient(0, 75+30, 600, 75+30);
  gradient3.addColorStop(0, '#FFDD00');
  gradient3.addColorStop(1, '#FFFADD');

  drawingContext.fillStyle = gradient3;
  rect(0, 75, 899, 60); 

  let gradient4 = drawingContext.createLinearGradient(160+213/2, -310, 160+213/2, -310+667);
  gradient4.addColorStop(0, '#FFDD00');
  gradient4.addColorStop(1, '#FFFFFF');

  drawingContext.fillStyle = gradient4;
  rect(160, -310, 213, 667);

  let gradient5 = drawingContext.createLinearGradient(-117, 510+45, -117+630, 510+45);
  gradient5.addColorStop(0, '#FFDD00');
  gradient5.addColorStop(0.7, '#FFFADD');
  gradient5.addColorStop(1, '#FFFFFF');

  drawingContext.fillStyle = gradient5;
  rect(-117, 510, 630, 90);


  fill('#FFDD00');
  ellipse(160+213/2, 248+213/2, 213);
  ellipse(467+90/2, 510+90/2, 90);
  ellipse(733+90/2, 323+90/2, 90);
  fill('#FFEC6D');
  ellipse(868+60/2, 75+60/2, 60);
  ellipse(868+60/2, 203+60/2, 60);

  let gradient7 = drawingContext.createLinearGradient(816, -31, 816, 1235);
  gradient7.addColorStop(0, '#2D84CB');
  gradient7.addColorStop(1, '#E3E3E3');

  drawingContext.fillStyle = gradient7;
  beginShape();
  vertex(1229, -15);
  bezierVertex(1183, 105, 1160, 160, 1137, 207);
  bezierVertex(1121, 238, 1095, 292, 1051, 317);
  bezierVertex(999, 344, 897, 384, 849, 427);
  bezierVertex(790, 481, 814, 571, 779, 596);
  bezierVertex(723, 637, 653, 624, 629, 694);
  bezierVertex(603, 767, 636, 843, 610, 921);
  bezierVertex(583, 998, 521, 1042, 471, 1094);
  bezierVertex(443, 1122, 404, 1163, 359, 1256);
  vertex(404, 1273);
  bezierVertex(422, 1224, 463, 1164, 496, 1126);
  bezierVertex(539, 1076, 614, 1028, 640, 950);
  bezierVertex(667, 873, 651, 801, 677, 728);
  bezierVertex(701, 658, 757, 663, 813, 622);
  bezierVertex(848, 597, 827, 534, 887, 480);
  bezierVertex(934, 437, 994, 427, 1047, 423);
  bezierVertex(1104, 423, 1130, 416, 1161, 398);
  bezierVertex(1192, 378, 1208, 360, 1254, 239);
  vertex(1229, -15);
  endShape();


}
