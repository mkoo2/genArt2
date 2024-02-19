function makeStars() {
	cg1.clear();
	cg1.push();
	cg1.translate(cg1.width / 2, cg1.height / 2);
	cg1.stroke(255);
	let count = 0;
	for (let r = stars.getRowCount() - 1; r >= 0; r--) {
		cg1.push();
		let srad = int(stars.getString(r, 2)); //RA hours
		let sram = int(stars.getString(r, 3)); //RA minutes
		let sras = int(stars.getString(r, 4)); //RA seconds
		let aval = (srad + (sram / 60) + (sras / 3600)); // Right ascension
		let ang = map(aval, 0, 24, 0, TAU);
		let decd = int(stars.getString(r, 5)); //DEC degrees
		let decm = int(stars.getString(r, 6)); //DEC minutes
		let decs = int(stars.getString(r, 7)); //DEC seconds
		let dval = (decd + (decm / 60) + (decs / 3600)); // Declination
		let rad = map(hemi * dval, 0, 90, oheight, 0);
		let vmag = stars.getString(r, 10); //Brightness value
		let spec = stars.getString(r, 13); //Spectral color code (M, K, G, F, A, K, O)
		let speccol = color(spectypes[spec]);
		speccol.setAlpha(random(150, 220));
		let radius = map(vmag, -1.47, 5, 8, 2); // Scale
		if (hemi * decd > 0) {
			let name = stars.getString(r, 1).toUpperCase().substr(-3); //Constellation code is last three characters
          if (name == 'CAP') {
//            console.log(name + ":" + aval + ", " + ang + "," + rad)
          }
          if (name == 'UMI') {
//            console.log(name + ":" + aval + ", " + ang + "," + rad)
			cg1.rotate(hemi * ang);
			cg1.translate(0, rad);
			cg1.noStroke();
          } else {
			cg1.rotate(hemi * ang);
			cg1.translate(0, rad);
			cg1.noStroke();
          }
			if (radius < 2) {
				if (ccbox.checked()) cg1.fill(255, random(150, 220));
				else cg1.fill(speccol);
				cg1.ellipse(0, 0, radius * oheight / 566, radius * oheight / 566);
			} else {
				if (name == cabbrevs[0]) {
					cg1.fill(colors[0]);
				} else if (name == cabbrevs[1]) {
					cg1.fill(colors[1]);
				} else if (name == cabbrevs[2]) {
					cg1.fill(colors[2]);
				} else if (name == cabbrevs[3]) {
					cg1.fill(colors[3]);
				} else if (name == cabbrevs[4]) {
					cg1.fill(colors[4]);
				} else if (name == cabbrevs[5]) {
					cg1.fill(colors[5]);
				} else if (name == cabbrevs[6]) {
					cg1.fill(colors[6]);
				} else if (name == cabbrevs[7]) {
					cg1.fill(colors[7]);
				} else if (name == cabbrevs[8]) {
					cg1.fill(colors[8]);
				} else if (name == cabbrevs[9]) {
					cg1.fill(colors[9]);
				} else if (name == cabbrevs[10]) {
					cg1.fill(colors[10]);
				} else if (name == cabbrevs[11]) {
					cg1.fill(colors[11]);
				} else if (name == cabbrevs[12]) {
					cg1.fill(colors[12]);
				} else if (name == cabbrevs[13]) {
					cg1.fill(colors[13]);
				} else cg1.fill(255, 220);
				if (ccbox.checked() == false) cg1.fill(speccol);
				starburst(0, 0, radius * oheight / 566);
				cg1.noStroke();
				cg1.ellipse(0, 0, radius * oheight / 566, radius * oheight / 566);
			}
		}
		cg1.pop();
	}
	cg1.pop();
}

function starburst(x, y, rad, col) {
	cg1.push();
	cg1.translate(x, y);
	cg1.scale(rad / 8);
	for (let i = 0; i < 50; i++) {
		cg1.push();
		cg1.rotate(random(TAU));
		cg1.stroke(random(200, 255), rad * 20);
		cg1.strokeWeight(0.3);
		cg1.line(random(-2.5 * rad, -rad), 0, random(rad, 2.5 * rad), 0);
		cg1.pop();
	}
	cg1.pop();
}

function makeSky() {
	let start = color(3, 18, 40);
	let end = color(0, 0, 0);
	cg0.clear();
	cg0.translate(cg0.width / 2, cg0.height / 2);
	for (let r = 2 * height; r > 0; r-=3) {
		let a = map(r, 2 * height, 0, HALF_PI, 0);
		let col = lerpColor(start, end, cos(a));
		cg0.stroke(col);
		cg0.strokeWeight(3);
		cg0.ellipse(0, 0, r, r);
	}
}