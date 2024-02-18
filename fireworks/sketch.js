let particles = [];
const gravity = .25;
const redColor = 'red';
const yellowColor = 'magenta';
const colors = [redColor, 'orange', yellowColor, 'lime', 'cyan', 'magenta', 'white'];
let endColor;
let houses;

function setup() {
	pixelDensity(1);
	createCanvas(600, 600);
	endColor = color(64, 0);
	makeHouses();
}

function makeHouses() {
	houses = createGraphics(width, height);
	houses.strokeWeight(2);
	const houseCount = 10;
	const houseWidth = width / houseCount;
	const houseWindowWidth = 10;
	const houseWindowHeight = 15;
	for (let i = 0; i < houseCount; i++) {
		const houseHeight = random(35, 100);
		houses.fill(128);
		houses.rect(houseWidth * i, height - houseHeight, houseWidth, houseHeight * 2);

		for (let windowY = height - houseHeight + 10; windowY < height - houseWindowHeight - 5; windowY += houseWindowHeight + 5) {
			houses.fill(random() < 0.25 ? yellowColor : 64);
			houses.rect(houseWidth * i + 12, windowY, houseWindowWidth, houseWindowHeight);

			houses.fill(random() < 0.25 ? yellowColor : 64);
			houses.rect(houseWidth * (i + 1) - 12 - houseWindowWidth, windowY, houseWindowWidth, houseWindowHeight);

		}
	}
}

function mousePressed() {
    fireWk = new Firework(mouseX, height);
    print("firework speed: " + Math.floor(fireWk.xSpeed) + " " + Math.floor(fireWk.ySpeed));
	particles.push(fireWk);
}

function draw() {
	background(64);
	particles.forEach((p) => {
		p.step();
		p.draw();
	});
	particles = particles.filter((p) => p.isAlive);

	//console.log("4343" + particles.length);
	image(houses, 0, 0);
}

class Particle {
	constructor(x, y, xSpeed, ySpeed, pColor, size, partNum) {
		this.x = x;
		this.y = y;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.color = pColor;
		this.size = size;
		this.isAlive = true;
		this.trail = [];
		this.trailIndex = 0;
        this.partNum = partNum;
	}

	step() {
		this.trail[this.trailIndex] = createVector(this.x, this.y);
		this.trailIndex++;
		// if (this.trailIndex > 10) {
		// 	this.trailIndex = 0;
		// }
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		this.ySpeed += gravity;

		if (this.y > height) {
			this.isAlive = false;
		}
	}

	draw() {
		this.drawTrail();
		fill(this.color);
		noStroke();
		rect(this.x, this.y, this.size, this.size);
      
        if (this.fireWork && false) {
          debugger;
          print("firework: "+ Math.floor(this.x) + " " + Math.floor(this.y) + " " + Math.floor(this.countdown));
        }
      
//        if (this.partNum == -2) {
//          print("partNum-2: "+ Math.floor(this.x) + " " + Math.floor(this.y) + " " + Math.floor(this.ySpeed) );
//        }

	}

	drawTrail() {
		let index = 0;

		for (let i = this.trailIndex - 1; i >= 0; i--) {
			const tColor = lerpColor(color(this.color), endColor,
				index / this.trail.length);
			fill(tColor);
			noStroke();
			rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
			index++;
		}

		for (let i = this.trail.length - 1; i >= this.trailIndex; i--) {
			const tColor = lerpColor(color(this.color), endColor,
				index / this.trail.length);
			fill(tColor);
			noStroke();
			rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
			index++;
		}
	} // drawTrail
}

class Firework extends Particle {
	constructor(x, y) {
		super(x, y, random(-2, 2), random(-10, -15),
			random(colors), 10, -1);
		this.countdown = random(30, 60);
        this.fireWork = true;
        this.firstNegative = false;
	}

	step() {
		super.step();

		this.countdown--;
		if (this.countdown <= 0) {
			const explosionSize = random(20, 50);
            print("explosion num347:" + Math.floor(explosionSize));
			for (let i = 0; i < explosionSize; i++) {

				const speed = random(5, 10);
				const angle = random(TWO_PI);
				const xSpeed = cos(angle) * speed;
				const ySpeed = sin(angle) * speed;
              
                let xColor = this.color;
                let iNum = i;
                if (ySpeed < 0 && !this.firstNegative) {
                  // if the firework color is yellow use the red color
                  // to track my one particle 
                  if (this.color == yellowColor) {
                    xColor = redColor;
                  } else {
                    xColor = yellowColor;  
                  }
                  print("part speed " + iNum + ": "+ Math.floor(xSpeed) + " " + Math.floor(ySpeed));
                   this.firstNegative = true;
                   iNum = -2;
                }
              
                const partX = new Particle(this.x, this.y,
					xSpeed, ySpeed,
					//this.color,
                    xColor,                       
                    5, iNum);

				particles.push(partX);
			}
			this.isAlive = false;
		} // if 
	} // step
}