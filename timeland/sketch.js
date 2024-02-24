let colors = ['#be7f73', '#b75446', '#94402b', '#57507e', '#363169']

let drips = []
let drippers = []
let bgColor
let next = false
let w


function setup() {
	createCanvas(windowWidth, windowHeight);
	w = max(windowWidth, windowHeight)
	bgColor = color('#FFFFC7')
	background(bgColor);
	bgColor.setAlpha(30)
	drippers.push(new dripper())
}

function draw() {

	if (next) {
		let g = get()
		background('#FFFFC7')
		image(g, 0, -30)
		image(g, 0, height - 30, width, 30, 0, height - 30, width, 30)
		background(bgColor)
		let drpr = new dripper()
		drippers.push(drpr)
		next = false
	}

	for (let dr of drippers) {
		dr.move();
		dr.paint();
		dr.done();
	}
	for (let d of drips) {
		d.droop();
		d.dry();
	}

}

class dripper {
	constructor(x, y) {
		this.pos = createVector(x, y)
		//this.acc= createVector(0.01, 0)
		this.vel = createVector(4, 0)
		this.colorGrad = random(100)
		this.priorY = 0
		this.lowSpot = createVector(0, 0);
		this.lowestSpot = createVector(0, 0);
		this.lowSpotId = 0;
		this.lowSpotCount = 1;
		this.lowSpotComparator = int(random(2, 4));

	}

	move() {
		let yoff = map(noise(this.pos.x / 500, frameCount / 100, this.colorGrad), -0.1, 1, height / 2, height)
		this.pos.add(this.vel)
		this.pos.y = yoff
	}

	paint() {
		let grad1 = this.colorGrad % 4
		let c1 = color(colors[floor(grad1)])
		let c2 = color(colors[floor((grad1 + 1) % 4)])
		let c = lerpColor(c1, c2, grad1 % 1)
		//console.log("grad23:" + grad1 + " " + grad1%1)

		let drp = new drip(this.pos.x, this.pos.y, c)

		let diff = (this.pos.y - this.priorY)
		let isDiffDrip = false
		let lowSpotOffset = 300

		if (this.priorY > this.pos.y && this.pos.x > lowSpotOffset) {
			this.lowSpot = createVector(this.pos.x, this.pos.y)

			if (this.lowestSpot.y == 0 ||
				this.lowestSpot.y + 5 < this.lowSpot.y) {

				this.lowestSpot = createVector(this.pos.x, this.pos.y)
				this.lowSpotCount++;

			}
		}

		if (this.lowestSpot.y > 0 &&
			this.lowSpotCount == this.lowSpotComparator && this.lowSpotId == 0) {
			this.lowSpotId = 1;
			this.pos.x = this.pos.x - 4 + 7;

			//        console.log("compar33:" + this.lowSpotComparator)
			drp.lowSpot = true;
		}

		if (this.lowestSpot.y > 0 && this.lowSpotId == 1) {
			this.lowSpotId = 2;
		}

		this.priorY = this.pos.y;

		drips.push(drp)
		this.colorGrad += 0.007

	}

	done() {
		if (this.pos.x > w * 2) {
			let index = drippers.indexOf(this);
			drippers.splice(index, 1);
			next = true
		}
	}
}


class drip {
	constructor(x, y, c) {
		this.pos = createVector(x, y);
		this.acc = createVector(0, 0);
		this.vel = createVector(0, 0);
		this.color = c;
		this.stroke = c
		this.alpha = 20
		this.size = 3
		this.sizeVel = random(0.15, 0.3)
		this.sizeD = random(100, 200)
		this.sizeAcc = -this.sizeVel / this.sizeD
		this.sNoise = random(1000)
		this.timerEnd = (height - this.pos.y) * 2.5
		this.timer = 0
		this.lowSpot = false;
	}

	droop() {
		this.sNoise += 0.01
		this.timer += 1
		if (this.timer < this.timerEnd / 2) {
			this.acc = createVector(0, 0.01)
		} else {
			this.acc = createVector(0, -0.009)
		}
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.alpha -= 0.01
		this.stroke.setAlpha(this.alpha / 2)
		this.color.setAlpha(this.alpha)

		if (this.lowSpot == true) {
			this.color = color('cyan')
		}

		fill(this.color)
		stroke(this.stroke)
		this.sizeVel += this.sizeAcc
		this.size += this.sizeVel
		let sOff = map(noise(frameCount / 100, this.sNoise), 0, 1, -this.size / 3, this.size / 3)
		//console.log ("drip432:" + this.pos.x + " " + this.pos.y );
		let sizeX = this.size
		if (this.lowSpot == true) {
			//        sOff = 0;
			sizeX = 4 + sOff
		}

		arc(this.pos.x, this.pos.y, sizeX, this.size + sOff, 0, PI)
	}

	dry() {
		//console.log("dry43:" + this.timer + " " + this.timer.End )
		if (this.timer > this.timerEnd) {
			let index = drips.indexOf(this);
			drips.splice(index, 1);

		}

	}
}

