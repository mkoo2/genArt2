const c = 30;
const G = 3;
const dt = 0.1;

let m87;
let particles = [];

let start1;
let end1;

function setup() {
  createCanvas(windowWidth, 600);
  ellipseMode(RADIUS);
  m87 = new Blackhole(300, 320, 3000);

  start1 = height / 2;
  end1 = height / 2 - m87.rs * 2.6;
  for (let y = 0; y < start1; y += 15) {
    particles.push(new Photon(width - 20, y));
  }
}
function mousePressed() {
//  console.log("mouse press");
  particles = [];

  let start1 = height / 2;
  let end = height / 2 - m87.rs * 2.6;
  for (let y = 0; y < start1; y += 20) {
    particles.push(new Photon(width - 20, y));
  }

}

function draw() {
  background(230);
  m87.show();

  stroke (0);
  strokeWeight(1);
  line(0,start1, width, start1);
  line(0,end1, width, end1);

  for (let p of particles) {
    const force = m87.pull(p);
    //p.applyForce(force);

    p.update();
    p.show();
  }
}
