/*

Vancouver, Canada

Everyone says it always rains here....

@cartocopia
2023-04-07

r0.1 - added balconies and curved windows
r0.11 - added building shading
r0.2 - added difference clouds

#WCCChallenge - Where I Livea

Left click regenerates the scene
Right Click saves the image

image colour palette is (mostly) from historic paint colours used on Vancouver houses....

Colour palettes from https://www.vancouverheritagefoundation.org/wp-content/uploads/2022/09/VHF001_Brochure_v9_Final.pdf
  The True Colours paint palette for Western Canada© is the product 
  of more than 30 years of research by Vancouver Heritage Foundation. 

*/

//------------------------------------------
//   Set rain to false to have a nice day!
//------------------------------------------
let rain = true;


let start; // timer for rain
let fc; // my framecounter to allow restarts
let ar = 1; //aspect ratio
let MAXINT = 65535 // convenience
// building colours
let bc = ['#3d3b33', '#c08755', '#b19b83', '#6d1f12', '#4d5b67', '#8f7157', '#9d9e9b', '#f6d292', '#727d87', '#0b0002'];

let dnoff = [0, 0]; // used for difference noise offset in clouds

function setup() {
	pixelDensity(1);
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault()); // disable right click context menu

	ar = width / height;
	smooth();
	strokeJoin(ROUND);
	startmeup();
}

function startmeup() {
	start = millis(); //restart rain timer
	noiseDetail(6, 0.5); // terrain noise, noiseDetail(6, 0.5) works well for mountains
	fc = 0; //resetr framecounter
	dnoff[0] = random(99);
	dnoff[1] = random(99);
	background(255);
}

function draw() {
	//coordinate system is y-up for drawing.  This also makes rotations go counterclockwise....
	scale(1, -1);
	translate(0, -height);

	switch (fc) { //frame counter  These are split apart because of the mountain gradients taking so much time....
		case 0: // a blank canvas
			background(255);
			break
		case 1: // paint the sky
			sky();
			break;
		case 2: // mountains
			s = random(MAXINT);
			mtn(0.91, 0.80, 10, '#2c0500', s);
			mtn(0.91, 0.80, 10, '#ECE8E8', s - .01);
			mtn(0.88, 0.81, 10, '#2c0500', s);
			break;
		case 3: // more mountains
			s = random(MAXINT);
			mtn(0.85, 0.75, 6, '#440a1f', s);
			mtn(0.85, 0.75, 6, '#CCBCC2', s - .01);
			mtn(0.83, 0.76, 6, '#440a1f', s);
			break;
		case 4: // even more mountains
			s = random(MAXINT);
			mtn(0.80, 0.72, 4, '#D3C0BF', s - 0.02);
			mtn(0.80, 0.72, 4, '#5f1815', s);
			break;
		case 5: // small mountains
			mtn(0.71, 0.68, 2, '#67594e', random(MAXINT));
			break;
		case 6: // tree covered mountains
			tree_mtn(0.68, 0.62, 5, '#98979e', random(MAXINT), 5);
			tree_mtn(0.62, 0.55, 3, '#94a182', random(MAXINT), 10);
			tree_mtn(0.58, 0.5, 2, '#7a8c81', random(MAXINT), 20);
			tree_mtn(0.5, 0.4, 5, '#425243', random(MAXINT), 30);
			break;
		case 7: // city 
			let count = floor(width / 30); // number of building
			let bx = [];
			for (let i = 0; i < count; i++) { // evenly spaced with randomness
				bx.push(i * (width / count) + random(-20, 20));
			}
			shuffle(bx, true); //shuffle order
			for (let i = 0; i < count; i++) {
				let x = bx[i];
				let h = random(80, 80 + sin(PI * x / width) * 450); //higher in the middle
				let w = map(h, 80, 530, 120, 40) * random(0.8, 1.2); //the higher, the skinnier
				building(x, height * 0.15, w, h, bc[floor(random(bc.length))]); //draw the building
			}
			break;
		case 8: //landmarks.  No representations are made to geographical accuracy
			noStroke();
			fill('#425243');
			rect(0, 0, width, height * 0.15); // some green by the water
			harbour_centre(width * 0.75 + random(-width / 20, width / 20), height * 0.15);
			bc_place(width * .45 + random(-width / 20, width / 20), height * 0.14);
			science_world(width * .2 + random(-width / 20, width / 20), height * 0.14);
			canada_place(width * 0.75 + random(-width / 20, width / 20), height * 0.14);
			break;
		case 9: // waterfront walk and water
			noStroke();
			fill('#4d5b97');
			rect(0, 0, width, height * 0.13);
			stroke('#0b0002');
			strokeWeight(2);
			line(0, height * 0.14, width, height * 0.14);
			line(0, height * 0.135, width, height * 0.135);
			let pcount = width / 10;
			for (i = 0; i < pcount; i++) {
				line(i * 10 + random(-2, 2), height * 0.132, i * 10 + random(-1, 1), height * 0.141);
			}
			break;
		default:
			break;
	}

	//rain
	if (rain) {
		// subtly animated clouds
		if (millis() - start > 3000) { // then the clouds
			noiseDetail(8, 0.85);
			let noiseScale = 0.0001;
			noStroke();
			for (i = 0; i < 3000; i++) {
				let rx = random(width);
				let ry = random(height);
				let v = noise(rx * noiseScale, ry * noiseScale * 2);
				v = abs(v - noise(rx * noiseScale + dnoff[0] - fc / 1000, ry * noiseScale + fc / 2000 + dnoff[1])); //difference noise
				let z = map(v, 0, 1, 180, 245);
				let a = map(v, 0, 1, 8, 32) * sq(sq(map(ry, 0, height, 0, 1)));
				fill(z, z, z, a);
				ellipse(rx, ry, random(20, 50), random(2, 20));
			}
			let rd = random(160, 230);
			if (millis() - start > 10000 && millis() - start < 20000) { // then the clouds
				strokeWeight(1);
				stroke(rd, rd, rd, map(millis() - start, 0, 80000, 0, 255)); //decrease opacity
				for (let i = 0; i < 1000; i++) {
					let rx = random(-10, width);
					let ry = (1 - pow(random(0, 1), 3)) * (height + 20); // heavier rain up higher
					line(rx, ry, rx + 5 + random(2), ry - 20);
				}
			}
		}
	}



	fc++; // increment the framecounter
}

//-----------------------------
// Nice random builing function
//
function building(_x, _y, _w, _h, _c,) {
	let x = _x;
	let y = _y;
	let w = _w;
	let h = _h;
	let c = color(_c);

	let fh = random(20, 30); // floor height
	let floors = floor(h / fh); //number of floors
	fh = h / floors; // back calculate exact floor size

	let wh = fh * random(0.5, 1); // window height
	let windows = floor(random(3, 10)); // number of windows
	let wr = random(0.2, 1); //window ratio
	let ww = w / windows; //window width

	let squig = floor(abs(randomGaussian(0, 0.9))) * random(2, 5) // building squiggle
	let cycles = random(0.5, 5) // number of squiggle cycles

	let balc = (random(1) < 0.5);

	let x_off = x - w / 2 + (ww * (1 - wr)) / 2;
	let y_off = y + (fh - wh) / 2;
	for (j = 0; j < floors - 1; j++) {
		stroke(c);
		strokeWeight(2);
		noFill();
		if (balc) { //balconies
			rect(x - w / 2 - 5, y + j * h / floors, w + 10, fh / 3);
			strokeWeight(4);
			line(x - w / 2 - 5, y + j * h / floors, x + w / 2 + 5, y + j * h / floors)
		}
		fill(c);
		rect(squig * sin(cycles * TWO_PI * j / floors) + x - w / 2, y + j * h / floors, w, fh); //floor
		noStroke();
		if (brightness(c) > 50) {
			fill(0, 0, 0, 25);
			rect(squig * sin(cycles * TWO_PI * j / floors) + x - w / 2, y + j * h / floors, w * 0.50, fh); //floor shadow
		} else {
			fill(255, 255, 255, 25);
			rect(squig * sin(cycles * TWO_PI * j / floors) + x, y + j * h / floors, w * 0.50, fh); //floor shadow
		}
		if (brightness(c) > 50) { //windows light or dark depends on building colour
			fill(50);
			stroke(50);
		} else {
			fill(230);
			stroke(230);
		}
		if (random(1) < 0.9 || squig > 3) { //skip the occasional floor or if the building is real squiggly
			for (i = 0; i < windows; i++) {
				strokeWeight(2);
				if ((j < floors - 2) || (floors > 7) || squig > 0) {
					rect(squig * sin(cycles * TWO_PI * j / floors) + x_off + i * ww, y_off + j * h / floors, ww * wr, wh); //windows
				} else { //top floor
					if (windows % 2 == 1) {
						arc(squig * sin(cycles * TWO_PI * j / floors) + x_off + i * ww + ww * wr / 2, y_off + j * h / floors + wh / 2, ww * wr, wh / 2, 0, PI, CHORD); //windows
						rect(squig * sin(cycles * TWO_PI * j / floors) + x_off + i * ww, y_off + j * h / floors, ww * wr, wh / 2); //windows
					} else {
						if (i % 2 == 0) {
							arc(squig * sin(cycles * TWO_PI * j / floors) + x_off + i * ww + ww * wr / 2 + (ww * wr) / 2, y_off + j * h / floors, 2 * ww * wr, wh, HALF_PI, PI, PIE); //windows
						} else {
							arc(squig * sin(cycles * TWO_PI * j / floors) + x_off + i * ww + ww * wr / 2 - (ww * wr) / 2, y_off + j * h / floors, 2 * ww * wr, wh, 0, HALF_PI, PIE); //windows
						}
					}
				}
			}
		} else { //replace with horizontal lines instead of windows
			strokeWeight(2);
			let l = floor(random(4));
			for (i = 0; i < l; i++) {
				line(squig * sin(cycles * TWO_PI * j / floors) + x - w / 2, y + j * fh + (i + 1) * fh / (l + 1),
					squig * sin(cycles * TWO_PI * j / floors) + x + w / 2, y + j * fh + (i + 1) * fh / (l + 1));
			}
		}
	}
	//roof options
	strokeWeight(2);
	fill(c);
	stroke(c);
	let roof = floor(random(1, 6));
	switch (roof) {
		case 1: //slope right
			triangle(x - w / 2, y + h, x - w / 2, y + h - fh, x + w / 2, y + h - fh);
			break;
		case 2: //slope left
			triangle(x - w / 2, y + h, x + w / 2, y + h - fh, x - w / 2, y + h - fh);
			break;
		case 3: // peak
			triangle(x - w / 2, y + h - fh, x + w / 2, y + h - fh, x, y + h + fh * random(-0.5, 0.5));
			break;
		case 4: // dome
			let ds = random(0.2, 0.8);
			arc(x, y + h - fh, ds * w, ds * w, 0, PI);
		default: //flat
			rect(x - w / 2, y + h - fh, w, fh * random(0.1, 0.5)); //flat
			break;
	}
	//roof greebles
	for (let i = 0; i < random(w / 10); i++) {
		rect(x - w / 2 + w * random(0.9), y + h - fh, w * random(0.1), fh * random(0.7, 1.2));
	}
}

function canada_place(_x, _y) {
	let x = _x;
	let y = _y - 2;
	let w = 250;
	let h = 40;
	push();
	noStroke();
	rectMode(CENTER);
	fill(200);
	rect(x, y + h / 2, w + 20, h);
	fill(30);
	for (i = 0; i < 20; i++) {
		for (j = 0; j < 3; j++) {
			rect(x - w / 2 + w * i / 19, y + 10 + h * j / 4, w / 24, h / 5);
		}
	}
	fill(220);
	stroke(220);
	strokeWeight(1);
	for (i = 0; i < 5; i++) {
		triangle(x - w / 2 + w * (i + 0.4) / 5, y + h, x - w / 2 + w * (i + 1) / 5, y + h, x - w / 2 + w / 12 + w * i / 5, y + 2.2 * h)
	}
	fill(250);
	stroke(250);
	strokeWeight(1);
	for (i = 0; i < 5; i++) {
		triangle(x - w / 2 + w * i / 5, y + h, x - w / 2 + w * (i + 0.4) / 5, y + h, x - w / 2 + w / 8 + w * i / 5, y + 2.5 * h)
	}
	pop();
}

function science_world(_x, _y) {
	let x = _x;
	let y = _y - 2;
	let w = 100;
	let h = 20;
	push();
	noStroke();
	rectMode(CENTER);
	stroke(240)
	strokeWeight(2);
	fill(200);
	circle(x, y + h * 3.5, w);
	fill(240);
	rect(x, y + h, w * 0.6, h);
	fill(230);
	stroke(240)
	rect(x, y + h / 2, w, h);
	for (i = 0; i < 8; i++) {
		line(x - w * sin(PI * i / 8) / 2, y + h * 3.5 + w * cos(PI * i / 8) / 2, x + w * sin(PI * i / 8) / 2, y + h * 3.5 + w * cos(PI * i / 8) / 2)
		for (j = 0; j < 8; j++) {
			let x0 = x - w * cos(PI * j / 8) * sin(PI * i / 8) / 2;
			let y0 = y + h * 3.5 + w * cos(PI * i / 8) / 2;
			let x1 = x - w * cos(PI * (j + 1) / 8) * sin(PI * (i + 1) / 8) / 2;
			let y1 = y + h * 3.5 + w * cos(PI * (i + 1) / 8) / 2;
			line(x0, y0, x1, y1);
			x1 = x - w * cos(PI * (j - 1) / 8) * sin(PI * (i + 1) / 8) / 2;
			y1 = y + h * 3.5 + w * cos(PI * (i + 1) / 8) / 2;
			line(x0, y0, x1, y1);
		}
	}
	pop();
}

function bc_place(_x, _y) {
	let x = _x;
	let y = _y - 2;
	let w = 300;
	let h = 50;
	push();
	noStroke();
	rectMode(CENTER);
	fill(230);
	rect(x, y + h / 2, w, h);
	fill(200);
	rect(x, y + h, w + 20, h / 2);
	fill(250);
	arc(x, y + h * 1.25, w, h, 0, PI);
	stroke(30);
	strokeWeight(2);
	line(x - w / 2, y + h, x + w / 2, y + h);
	line(x - w / 2, y + h + 5, x + w / 2, y + h + 5);
	line(x - w / 2, y + h - 5, x + w / 2, y + h - 5);
	fill(210);
	stroke(210);
	strokeWeight(1);
	for (i = 0; i < 20; i++) {
		triangle(x + 0.5 * (w + 10) * cos(PI * i / 20) - 2, y + h * 0.75, x + 0.5 * (w + 10) * cos(PI * i / 20) + 2, y + h * 0.75, x + 0.5 * (w + 60) * cos(PI * i / 20) + 2, y + 2 * h)
	}
	pop();
}

function harbour_centre(_x, _y) {
	let x = _x;
	let y = _y;
	let w = 100;
	let h = 250;
	let c = color('#f0daad');

	let fh = 15; // floor height
	let floors = floor(h / fh); //number of floors;
	fh = h / floors // back calculate exact floor size

	let wh = fh * .5; // window height
	let windows = 6; // number of windows
	let wr = 0.5; //window ratio
	let ww = w / windows; //window width

	let x_off = x - w / 2 + (ww * (1 - wr)) / 2;
	let y_off = y + (fh - wh) / 2;
	for (j = 0; j < floors - 1; j++) {
		stroke(c);
		fill(c);
		rect(x - w / 2, y + j * h / floors, w, fh); //floor
		fill(50);
		stroke(50);
		for (i = 0; i < windows; i++) {
			rect(x_off + i * ww, y_off + j * h / floors, ww * wr, wh); //windows
		}
	}

	//roof
	strokeWeight(2);
	fill(c);
	stroke(c);
	rect(x - w / 2, y + h - fh, w, fh * random(0.1, 0.5)); //flat

	//platform
	push();
	rectMode(CENTER);
	stroke(c);
	rect(x, y + h + 50, 80, fh);
	rect(x, y + h + 50 + fh, 100, fh);
	rect(x, y + h + 50 + fh * 2, 110, fh);
	rect(x, y + h + 50 + fh * 3, 60, fh);
	rect(x, y + h + 50, 5, 190);
	rect(x, y + h + 50, 1, 240);
	rect(x, y + h + 130, 10, 8);
	fill(50)
	noStroke();
	rect(x, y + h + 50 + fh, 100, fh / 2);
	rect(x, y + h + 50 + fh * 2, 110, fh / 2);
	pop();

	//elevator
	strokeWeight(2);
	fill(c);
	stroke(c);
	rect(x - ww, y, ww * 2, h + 41);
	stroke(50);
	line(x - ww / 2, y + fh / 2, x - ww / 2, y + h + 40);
	line(x + ww / 2, y + fh / 2, x + ww / 2, y + h + 40);
	line(x, y + fh / 2, x, y + h + 40);
}

// a nice recursive tree function.
function tree(_x, _y, _span) {
	quad(_x, _y, _x + _span, _y - _span / 2, _x, _y + _span, _x - _span, _y - _span / 2);
	if (_span > 2) {
		tree(_x + random(-_span, _span) / 8, _y + _span / 2, _span * 0.9);
	}
}

// gradient
function sky() {
	strokeWeight(2);
	//sky
	for (let i = 0; i < 0.15 * height; i++) {
		stroke(lerpColor(color(255, 255, 0), color(255, 255, 255), i / (0.15 * height)))
		line(0, i + 0.7 * height, width, i + 0.7 * height);
	}
	for (let i = 0; i < 0.15 * height; i++) {
		stroke(lerpColor(color(255, 255, 255), color(0, 255, 255), i / (0.15 * height)))
		line(0, i + 0.85 * height, width, i + 0.85 * height);
	}
}

// noise based mountain range
function mtn(_p, _v, _ns, _c, _r) {
	let p = _p; //max peax height
	let v = _v; //min valley low
	let ns = _ns * ar; // noise scale multiplied by the aspecy ratio so it looks OK on wide screens
	let r = _r; // noise offset

	let c_r = red(_c); // pixel blending for faster gradients
	let c_g = green(_c);
	let c_b = blue(_c);

	//get min and max to normalize
	let lmin = 1;
	let lmax = 0;
	for (let i = 0; i < width; i++) {
		let y = noise(ns * (i / width) + r);
		lmin = min(lmin, y);
		lmax = max(lmax, y);
	}

	loadPixels(); // pixeldensity is 1  //remember screen is inverted!
	for (let i = 0; i < width; i++) { // used noise plus a trig function to create more natural valleys
		let y = map(noise(ns * (i / width) + r) * sqrt((1 + sin(ar * TWO_PI * i / width + r)) / 2), lmin, lmax, v, p) * height;
		//line(i, 0, i, y);
		for (j = 0; j < y; j++) {
			let blend = (128 - y + j) >> 1; //faster
			index = ((height - j) * width + i) << 2; //faster
			pixels[index] = c_r + blend;
			pixels[index + 1] = c_g + blend;
			pixels[index + 2] = c_b + blend;
			pixels[index + 3] = 255;
		}
	}
	updatePixels();
	// stroke the line to get aliasing
	strokeWeight(2);
	stroke(lerpColor(color(_c), color(255), 0.3));
	for (let i = 0; i < width; i++) { // used noise plus a trig function to create more natural valleys
		let y = map(noise(ns * (i / width) + r) * sqrt((1 + sin(ar * TWO_PI * i / width + r)) / 2), lmin, lmax, v, p) * height;
		point(i, y);
	}
}

//similar to above but adds trees on the crest and does away with pixel blending...
function tree_mtn(_p, _v, _ns, _c, _r, _ts) {
	let p = _p;
	let v = _v;
	let ns = _ns * ar;
	let r = _r;
	let ts = _ts; //tree size

	//get min and max to normalize
	let lmin = 1;
	let lmax = 0;
	for (let i = 0; i < width; i++) {
		let y = noise(ns * (i / width) + r);
		lmin = min(lmin, y);
		lmax = max(lmax, y);
	}
	stroke(_c);
	fill(_c);

	for (let i = 0; i < width; i++) {
		let y = map(noise(ns * (i / width) + r), lmin, lmax, v, p) * height;
		strokeWeight(2);
		line(i, 0, i, y);
		if (i % _ts == 0) {
			strokeWeight(1);
			tree(i, y + random(-_ts * 2, 0), _ts)
		}
	}
}

function keyPressed() {
	if (millis() - lapse > 400) {
		if (keyCode == 32) {

			lapse = millis();
			startmeup();
		}; // SPACE 
	}
}

//Richard Bourne Special
// save jpg
let lapse = 0; // mouse timer
function mousePressed() {
	if (millis() - lapse > 400) {
		//		lapse = millis();
		if (mouseButton === RIGHT) {
			save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
		} else {
//			startmeup();
		}
	}
	return (false)
}