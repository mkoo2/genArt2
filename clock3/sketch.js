let radius = 180;

// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/addons/p5.sound.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js"></script>

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function rotationAxis(a, r) {
  var obj = {
    x: cos(a) * r,
    y: sin(a) * r
  }
  return obj;
}

function draw() {
  background(0);

  let hr = hour();
  let mn = minute();
  let sc = second();

  let d = new Date();
  d.toLocaleTimeString();  // -> "7:38:05 AM"

  //fill(130,250,0);
  // noStroke();
  textSize(50);
  noStroke();
  fill(255);
  //text(hr + ":" + mn + ":" + sc, -90, 195);
  text(d.toLocaleTimeString(), 90, 395);

  text("12", 170, 120);
  text("6", 185, 320);
  text("9", 80, 220);
  text("3", 295, 220);

  translate(200, 200);
  rotate(-90);

  strokeWeight(8);
  stroke(255, 100, 150);
  noFill();

  // fill('cyan');
  // let end = map(mouseX, 0, 60, 0, 360);
  // arc(0, 0, 280, 280, 0, end,PI);

  let secondAngle = map(sc, 0, 60, 0, 360);
  arc(0, 0, 300, 300, 0, secondAngle);

  let AxisSec = rotationAxis(secondAngle, radius * (2 / 3));
  point(AxisSec.x, AxisSec.y);
  secondAngle += TWO_PI / 60 / 20;
//  line(0, 0, AxisSec.x, AxisSec.y);

  noFill();
  stroke(150, 100, 255);
  let minuteAngle = map(mn, 0, 60, 0, 360);
  arc(0, 0, 280, 280, 0, minuteAngle);

  stroke(150, 255, 100);
  let hourAngle = map(hr % 12, 0, 12, 0, 360);
  arc(0, 0, 260, 260, 0, hourAngle);

  push();
  rotate(secondAngle);
  strokeWeight(3);
  stroke(255, 100, 150);
  line(0, 0, 100, 0);
  pop();

  push();
  rotate(minuteAngle);
  strokeWeight(6);
  stroke(150, 100, 255);
  line(0, 0, 75, 0);
  pop();

  push();
  rotate(hourAngle);
  stroke(150, 255, 100);
  line(0, 0, 50, 0);
  pop();

  strokeWeight(10);
  stroke(255, 0, 0);
  point(0, 0);

  strokeWeight(4);
  stroke(255);
  noFill()
  ellipse(0, 0, 312, 312);

}
