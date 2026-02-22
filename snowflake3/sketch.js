
// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/addons/p5.sound.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js"></script>
let snow = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  snow.push(new Snowflake(300,200));
}

function mousePressed() {

}

function draw() {
  background(0);

  for (flake of snow){
    flake.render();
  }

}
