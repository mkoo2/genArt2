let bullets = [];

function makeLabels() {
	let ydiv = 14 * height / 566;
	for (let i = 0; i < cnames.length; i++) {
		let y = 2 * ydiv + i * ydiv;
		let p = createP('• ' + cnames[i]);
		p.position(10, y);
		p.style('font-family', 'monospace');
		p.style('font-size', ydiv + 'px');
		p.style('color', colors[i]);
		bullets.push(p);
	}
	hlabel = createP('NORTHERN HEMISPHERE');
	hlabel.position(10, 0);
	hlabel.style('color', 'white');
	hlabel.style('font-family', 'monospace');
	hlabel.style('font-size', ydiv + 'px');
	hlabel.style('text-decoration', 'underline');

	ccbox = createCheckbox('Color Constellations?', true);
	ccbox.position(10, 17.5 * ydiv);
	ccbox.style('color', 'white');
	ccbox.style('font-family', 'monospace');
	ccbox.style('font-size', ydiv + 'px');
	ccbox.changed(recolorMap);

	arbox = createCheckbox('Auto Rotate?', true);
	arbox.position(10, 19 * ydiv);
	arbox.style('color', 'white');
	arbox.style('font-family', 'monospace');
	arbox.style('font-size', ydiv + 'px');

	axbox = createCheckbox('Show Axes?', true);
	axbox.position(10, 20.5 * ydiv);
	axbox.style('color', 'white');
	axbox.style('font-family', 'monospace');
	axbox.style('font-size', ydiv + 'px');
	
	b1 = createButton('Re-Center');
	b1.position(10, 22 * ydiv);
	b1.size(8 * ydiv, ydiv * 1.5);
	b1.mousePressed(recenterMap);
	b1.style('background-color', 'transparent');
	b1.style('color', 'white');
	b1.style('font-family', 'monospace');
	b1.mouseOver(f=>b1.style('background-color','rgb(77,76,126)'));
	b1.mouseOut(f=>b1.style('background-color','transparent'));

	b2 = createButton('Zoom In');
	b2.position(10, 24 * ydiv);
	b2.size(8 * ydiv, ydiv * 1.5);
	b2.style('font-family', 'monospace');
	b2.style('background-color', 'transparent');
	b2.style('color', 'white');
	b2.mousePressed(zoomIn);
	b2.mouseOver(f=>b2.style('background-color','rgb(77,76,126)'));
	b2.mouseOut(f=>b2.style('background-color','transparent'));

	b3 = createButton('Zoom Out');
	b3.position(10, 26 * ydiv);
	b3.size(8 * ydiv, ydiv * 1.5);
	b3.style('font-family', 'monospace');
	b3.style('background-color', 'transparent');
	b3.style('color', 'white');
	b3.mousePressed(zoomOut);
	b3.mouseOver(f=>b3.style('background-color','rgb(77,76,126)'));
	b3.mouseOut(f=>b3.style('background-color','transparent'));
	
	b4 = createButton('Full Screen');
	b4.position(10, 28 * ydiv);
	b4.size(8 * ydiv, ydiv * 1.5);
	b4.style('font-family', 'monospace');
	b4.style('background-color', 'transparent');
	b4.style('color', 'white');
	b4.mousePressed(goFull);
	b4.mouseOver(f=>b4.style('background-color','rgb(77,76,126)'));
	b4.mouseOut(f=>b4.style('background-color','transparent'));
	
	b5 = createButton('North/South');
	b5.position(10, 30 * ydiv);
	b5.size(8 * ydiv, ydiv * 1.5);
	b5.style('font-family', 'monospace');
	b5.style('background-color', 'transparent');
	b5.style('color', 'white');
	b5.mousePressed(switchHemisphere);
	b5.mouseOver(f=>b5.style('background-color','rgb(77,76,126)'));
	b5.mouseOut(f=>b5.style('background-color','transparent'));
}

function switchHemisphere() {
	hemi = -hemi;
	if (hemi == 1) hlabel.html('NORTHERN HEMISPHERE');
	else hlabel.html('SOUTHERN HEMISPHERE');
	cg1.clear();
	makeAxes();
	makeStars();
}

function recenterMap() {
	tcenter.x = 0;
	tcenter.y = 0;
	ztarget = 1;
}

function zoomIn() {
	ztarget += 0.1;
}

function zoomOut() {
	ztarget -= 0.1;
}

function goFull(){
	fullscreen(!fullscreen());
}

function recolorMap() {
	cg1.clear();
	makeAxes();
	makeStars();
	recolorLabels();
}

function recolorLabels() {
	for (let i = 0; i<bullets.length; i++) {
		if(ccbox.checked()) bullets[i].style('color', colors[i]);
		else bullets[i].style('color', 'rgb(229,227,227)');
	}
}
