function makeAxes() {
	cg2.clear();
	cg2.push();
	cg2.translate(cg2.width / 2, cg2.height / 2);
	for (let i = 0; i < 10; i++) {
		cg2.noFill();
		cg2.stroke(255);
		cg2.strokeWeight(0.2 * oheight / 566);
		cg2.ellipse(0, 0, 2 * i * oheight / 9, 2 * i * oheight / 9);
		cg2.textAlign(CENTER, BOTTOM);
		cg2.textFont('monospace');
		cg2.textSize(12 * oheight / 566);
		cg2.fill(255, 150);
		cg2.noStroke();
		if (i > 0 && i < 9) cg2.text((hemi * i <= 0 ? "" : "+") + (90 - 10 * i) * hemi + '°', 0, -i * oheight / 9);
		if (i > 0 && i < 9) {
			cg2.rotate(PI);
			cg2.text((hemi * i <= 0 ? "" : "+") + (90 - 10 * i) * hemi + '°', 0, -i * oheight / 9);
			cg2.rotate(-PI);
		}
		cg2.stroke(255);

	}
	for (let i = 0; i < 24; i++) {
		cg2.push();
		cg2.rotate(HALF_PI + hemi * (i * TAU / 24));
		cg2.line(oheight / 9, 0, oheight, 0);
		cg2.translate(oheight, 0);
		cg2.rotate(HALF_PI);
		cg2.textAlign(CENTER, BOTTOM);
		cg2.textFont('monospace');
		cg2.textSize(12 * oheight / 566);
		cg2.fill(255);
		cg2.noStroke();
		cg2.text(i.toString().padStart(2, '0') + 'h', 0, 0)
		cg2.pop();
	}
	cg2.pop();
}