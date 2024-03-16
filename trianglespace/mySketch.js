let vectors = []
let filler = {}
let mainHue;
// let iterator = 0

let triangles = [];
let iteratorArray = [];

let genNewTriangle = true

function setup() {
	// pixelDensity(5)
	createCanvas(920, 690);
	// background("black")
	colorMode(HSB)
	mainHue = random(360)
	vectors = []
	triangles = []
	iteratorArray = []
	genNewTriangle = true
	filler = {}
	const initialVerticies = [
		createVector(width * random(0.3, 0.7), 0),
		createVector(width, 0),
		createVector(width, height * random(0.3, 0.7)),
		createVector(width, height),
		createVector(width * random(0.3, 0.7), height),
		createVector(0, height),
		createVector(0, height * random(0.3, 0.7)),
		createVector(0, 0)
	]
	filler.lastVertex = createVector(0, height / 4)
	filler.nowVertex = createVector(0, 0)
	filler.offset = 0
	filler.count = 0
	filler.targetVertices = initialVerticies
	// vectors.push(filler.nowVertex.copy())
	vectors.push({
		vertex: filler.nowVertex.copy(),
		color: generateColor(),
	})

	// frameRate(5)
	// noLoop()
	noStroke()
}

function draw() {
	// background(255);

	if (genNewTriangle) {
		const newTriangle = findNewTriangle()
		if (filler.count != 1) {
			triangles.push(newTriangle)
			// print(newTriangle)
			fill(newTriangle.color.from)
			triangle(newTriangle.triangle[0].x, newTriangle.triangle[0].y,
				newTriangle.triangle[1].x, newTriangle.triangle[1].y,
				newTriangle.triangle[2].x, newTriangle.triangle[2].y)
		}
	}


	for (let i = 0; i < iteratorArray.length; i++) {
		const nowTriangle = triangles[iteratorArray[i]]
		// print(nowTriangle)
		nowTriangle.bezier[1].lerp(nowTriangle.bezier[0], 0.08)
		nowTriangle.bezier[2].lerp(nowTriangle.bezier[3], 0.08)
		colorMode(RGB)
		const nowColor = lerpColor(nowTriangle.color.from, nowTriangle.color.to, nowTriangle.iteration / 100)
		fill(nowColor)
		bezier(nowTriangle.bezier[0].x, nowTriangle.bezier[0].y,
			nowTriangle.bezier[1].x, nowTriangle.bezier[1].y,
			nowTriangle.bezier[2].x, nowTriangle.bezier[2].y,
			nowTriangle.bezier[3].x, nowTriangle.bezier[3].y)
		iteratorArray[i]++
		nowTriangle.iteration++
		if (iteratorArray[i] > triangles.length - 1) {
			iteratorArray.splice(i, 1)
			// print(iteratorArray)
		}
		// print(iteratorArray)
	}

	if (random() < 0.03) {
		newIteration()
	}
}

function newIteration() {
	iteratorArray.push(0)
}

function findNewTriangle() {
	const targetVertex = filler.targetVertices[filler.offset].copy()
	const nowVertex = filler.nowVertex.copy()
	const lastVertex = filler.lastVertex.copy()

	if (filler.count % 2 == 0) {
		const vec1 = p5.Vector.sub(targetVertex, nowVertex).mult(random(0.3, 0.7));
		if (vec1.mag() < 0.1) {
			genNewTriangle = false
		}
		// const normalVec = p5.Vector.rotate(vec1, PI/2).mult(random(0.2,0.5))
		const vec2 = p5.Vector.sub(lastVertex, nowVertex).mult(random(0.3, 0.7));
		// print(vec)
		const addVec = p5.Vector.add(vec1, vec2)
		filler.lastVertex = filler.nowVertex.copy()
		filler.nowVertex.add(addVec)
		filler.targetVertices.push(filler.nowVertex.copy())
		filler.count++
		// circle(filler.nowVertex.copy().x,filler.nowVertex.copy().y,20)
		return {
			triangle: [nowVertex.copy(), filler.nowVertex.copy(), lastVertex.copy()],
			bezier: [nowVertex.copy(), filler.nowVertex.copy(), filler.nowVertex.copy(), lastVertex.copy()],
			iteration: 0,
			color: generateColor()
		}
		// print(filler.nowVertex)
	} else {
		filler.lastVertex = filler.nowVertex.copy()
		filler.nowVertex = targetVertex
		filler.offset++
		filler.count++
		// circle(targetVertex.x,targetVertex.y,20)
		return {
			triangle: [nowVertex.copy(), targetVertex.copy(), lastVertex.copy()],
			bezier: [nowVertex.copy(), targetVertex.copy(), targetVertex.copy(), lastVertex.copy()],
			iteration: 0,
			color: generateColor()
		}
		// print(2)
	}

}

function keyPressed() {
	setup()
}

function mousePressed() {
	iteratorArray.push(0)
}

function generateColor() {
	let h = randomGaussian(mainHue, 20) % 360
	let s = randomGaussian(10, 10)
	let b = randomGaussian(50, 10)
	// if(random()<0.2){
	// 	s = randomGaussian(90,10)
	// 	b = randomGaussian(95,5)
	// }
	colorMode(HSB)
	return {
		from: color(random(360), 0, random(90, 100)),
		to: color(random(360), random(30, 100), random(70, 100), random(0, 1))
	}
}

let lapse = 0;    // mouse timer
function mousePressed() {
	// prevents mouse press from registering twice
	if (millis() - lapse > 400) {
		save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
		lapse = millis();
	}
}