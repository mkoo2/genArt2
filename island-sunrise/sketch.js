//For the #WCCChallenge, theme: "tiny island"
// noprotect
let sky, water, song, island;
let sunriseColor;

function preload() {
	
//	song = loadSound('hawaii.mp3');
}

function setup() {
	createCanvas(windowWidth, windowHeight / 1.5);
	sky = createGraphics(width, height);
	water = createGraphics(width, height);

	sunriseColor = "red";
	buildEnviron();

	imageMode(CENTER);
	background(0);
	textSize(height / 12);
	textAlign(CENTER, CENTER);
	fill(255, 150);
	noStroke();
	text('click to start sound', width / 2, height / 2);
	island = false;
//	noLoop();
}

function buildEnviron () {
	//sky
	for (let y = 0; y < 2 * height / 3; y++) {
		from = color('skyblue');
		to = color(sunriseColor); // 'red'
		current = lerpColor(from, to, map(y, 0, 2 * height / 3, 0, 1));
		sky.strokeWeight(2);
		sky.stroke(current);
		sky.line(0, y, width, y);
	}
	//sun rays in sky 
	for (let a = -PI; a < 0; a += PI / 120) {
		sky.stroke(255, 182, 193, 20 * -sin(a));
		sky.strokeWeight(height / 100);
		sky.line(width / 2, 2 * height / 3, width / 2 + cos(a) * width, 2 * height / 3 + sin(a) * height);
	}

	//water
	for (let y = 2 * height / 3; y < height; y++) {
		from = color(0, 0, 20, 255);
		to = color('turquoise');
		current = lerpColor(from, to, map(y, 2 * height / 3, height, 0, 1));
		water.strokeWeight(2);
		water.stroke(current);
		water.line(0, y, width, y);
	}
	//sun rays on water
	for (let a = 0; a < PI; a += PI / 120) {
		if (sunriseColor == 'orange') {
			water.stroke(255, 165, 0, 80 * sin(a)); // 

		} else {
			water.stroke(200, 0, 0, 80 * sin(a)); // red
		}
	water.strokeWeight(height / 80);
		water.line(width / 2 + cos(a) * height / 20, 2 * height / 3 + height / 100, width / 2 + cos(a) * width, 2 * height / 3 + sin(a) * height);

	}
	//clouds
	for (let a = HALF_PI; a < PI; a += HALF_PI / 60) {
		let y = sin(a) * 2 * height / 3.2
		let w = width / 64 - cos(a) * width / 12;
		let h = w * (0.25 - cos(a) / 8);
		drawCloud(random(width), y, w, h);
	}

}

function mousePressed() {
//	if (song.isPlaying()) return;
//	song.play();
	loop();
}

function draw() {
	translate(width / 2, height / 2);
	if (frameCount > 1 && frameCount < 10000) {
		if (frameCount == 2500) {
			sunriseColor = 'orange';
			buildEnviron();
		}
		scale(1.05 + sin(frameCount / 400) / 20)
		image(sky, 0, 0);
		//sun
		fill('gold');
		noStroke();
		// 100 - 15 + ; height = 600
		ellipse(0, height / 6 + height / 40 - frameCount / 200, height / 20);
		image(water, 0, 0);
		if (island) drawIsland();
		let alpha = max(255 - frameCount / 3, 0);
		let dim = max(map(frameCount, 0, 5000, 1, 0), 0);
		//ripples
		for (let a = HALF_PI; a <= PI; a += HALF_PI / 36) {
			let y = height / 2 + cos(a) * height / 3;
			y += sin(a) * cos((8 * a) + frameCount / 200) * height / 36;
			let w = (1 - sin(a)) * (width / 4) + noise((3 * a) + frameCount / 400) * width / 8;
			strokeWeight(map(a, HALF_PI, PI, 3, 0.5  ))
			if (sunriseColor == 'orange') {
				stroke(255, 165, 0, map(a, HALF_PI, PI, 0, 50)); // orange

			} else {
				stroke(255, 255, 255, map(a, HALF_PI, PI, 0, 50)); // red
			}
			line(-width / 2, y, width / 2, y);
			stroke(200, 0, 0, map(a, HALF_PI, PI, 0, 150) * dim);
			line(-w, y, w, y);
		}
		// for (let a = -2*PI/3; a < -PI/3; a += PI / 200) {
		// 	stroke(255, 182, 193, 20 * -sin(a));
		// 	strokeWeight(height / 100);
		// 	line(0, (height / 6 - height/120) , cos(a) * width, (height / 6 - height/120) + sin(a) * sky.height);
		// }
		fill(0, alpha);
		rectMode(CENTER);
		rect(0, 0, width, height);
	}
}

function drawCloud(cx, cy, w, h) {
	let ta = map(cy, 0, 2 * height / 3, 20, 60);
	let ba = map(cy, 0, 2 * height / 3, 10, 60);
	from = color('black');
	from.setAlpha(ta);
	to = color(sunriseColor); // red
	to.setAlpha(ba);
	sky.strokeWeight(1);
	for (let y = cy - h / 2; y < cy + h / 2; y += 0.5) {
		let ry = abs(2 * height / 3 - y) + (2 * height / 3);
		let a = map(y, cy - h / 2, cy + h / 2, 0, PI);
		current = lerpColor(from, to, map(y, cy - h / 2, cy + h / 2, 0, 1));
		sky.stroke(current);
		sky.line(cx - w * (sin(a) + noise((a + y) / 20)), y, cx + w * (sin(a) + noise((2 * a + y) / 20)), y);
		current.setAlpha(5);
		sky.stroke(current);
		water.line(cx - w * (sin(a) + noise((a + y) / 20)), ry, cx + w * (sin(a) + noise((2 * a + y) / 20)), ry);
	}
}

function drawIsland() {
	textAlign(CENTER, BOTTOM);
	textSize(height / 50);
	text('🏝️', 0, height / 6);
	textSize(height / 5);
}

function keyPressed() {
	if (keyCode == 32) island = !island;
	if (keyCode == 13) print(frameCount);
}