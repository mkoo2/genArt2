
// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/addons/p5.sound.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js"></script>
let snow = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.03);
}

function mousePressed() {

}

function draw() {
  background(0);

  snow.push(new Snowflake());

  for (flake of snow){
    flake.applyForce(gravity);
    flake.update();
    flake.render();
  }

  for (let i = snow.length -1; i >= 0; i-- ){
    if (snow[i].offScreen()) {
      snow.splice(i,1);
    }

  }

}
