// For the #WCCChallenge, theme: "connecting the dots."
// This sketch maps the 9000+ stars logged in the Yale Bright Star Catalog.
// These data are conveniently available in spreadsheet format here: 
// https://docs.google.com/spreadsheets/d/1zVSoeZ8gV-v5v9OSsMm02E6QPcNxc-XvGrGT6YhyOtI/edit#gid=1426262721
// About half of the stars are in the Northern Hemisphere, and half are in the Southern Hemisphere.
// Zodiac constellations (plus ursas major and minor) can be color-coded for enhanced visibility. 
// With color coding off, star colors are based on spectral data from the Bright Star Catalog.
// Connecting the dots of each constellation is DIY (as it is in real life)!

let cabbrevs = ['ARI', 'TAU', 'GEM', 'CAN', 'LEO', 'VIR', 'LIB', 'SCO', 'CAP', 'AQR', 'PSC', 'SGR', 'UMI', 'UMA'];
let cnames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Capricorn', 'Aquarius', 'Pisces', 'Saggitarius', 'Ursa Minor', 'Ursa Major'];
let colors = ['rgb(168,244,155)', 'rgb(235,26,3)', 'rgb(239,147,109)', 'rgb(254,199,7)', 'rgb(244,239,114)', 'rgb(7,17,248)', 'rgb(48,239,4)', 'rgb(5,212,218)', 'rgb(117,244,238)', 'rgb(165,159,252)', 'rgb(238,8,246)', 'rgb(235,188,237)', 'rgb(104,239,228)', 'rgb(40,229,1)'];
let zoom = 0.25;
let ztarget = 1;
let orient = 0;
let torient = 0;
let hemi = 1;
let time = 0;
let center, tcenter;
let oheight, owidth;

function preload() {
	stars = loadTable('BSC.csv', 'header');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	cg0 = createGraphics(2.25 * height, 2.25 * height);
	cg1 = createGraphics(2.25 * height, 2.25 * height);
	cg2 = createGraphics(2.25 * height, 2.25 * height);
	cg3 = createGraphics(2.25 * height, 2.25 * height);
	oheight = height;
	owidth = width;
	imageMode(CENTER);
	makeSky();
	makeLabels();
	makeAxes();
	makeStars();
	center = createVector(0, 0);
	tcenter = createVector(0, 0);
	orient = PI;
	torient = PI;
}

function draw() {
	background(0);
	center.lerp(tcenter, 0.1);
	translate(width / 2, height / 2);
	scale(zoom);
	translate(center);
	if(frameCount> 30) zoom = lerp(zoom, ztarget, 0.05);
	if (mouseIsPressed) {
		tcenter.x += zoom * movedX;
		tcenter.y += zoom * movedY;
	} else {
		if (arbox.checked()) torient += (Math.sign(center.y - (mouseY - height / 2)) * movedX / 200) - (Math.sign(center.x - (mouseX - width / 2)) * movedY / 200);
	}
	orient = lerp(orient, torient, 0.1);
	rotate(orient + time);
	if (arbox.checked()) time -= hemi / 2000;
	image(cg0,0,0);
	image(cg1, 0, 0);
	if (axbox.checked()) image(cg2, 0, 0);
}

function keyPressed() {
	// ARROW KEYS zoom and rotate
	if (keyCode == UP_ARROW) zoomIn();
	if (keyCode == DOWN_ARROW) zoomOut();
	if (keyCode == RIGHT_ARROW) torient += 0.1;
	if (keyCode == LEFT_ARROW) torient -= 0.1;
	//WASD KEYS move center of map up, down, left, and right
	if (keyCode == 87) tcenter.y += 20;
	if (keyCode == 83) tcenter.y -= 20;
	if (keyCode == 65) tcenter.x += 20;
	if (keyCode == 68) tcenter.x -= 20;
	if (keyCode == 32) recenterMap(); // SPACE recenters
	if (keyCode == 13) arbox.checked(!arbox.checked()); //ENTER toggles autorotation
	if (keyCode == 16) axbox.checked(!axbox.checked()); //SHIFT toggles axes
	if (keyCode == 67) { //C toggles star coloring
		ccbox.checked(!ccbox.checked());
		recolorMap();
	}
	if (keyCode == 70) goFull(); //F toggles fullscreen view
}

function windowResized() {
	if (fullscreen()) resizeCanvas(displayWidth, displayHeight);
	else resizeCanvas(windowWidth, windowHeight);
}