// Created for the #WCCChallenge - Topic: Improbable Architecture
//
// I used two-point perspective to draw this sketch - so this is made of up MANY calculations of lines and point intersections.
// I initially chose random hues just to distinguish each block during development, but decided to keep them as it reminded me of stacks of post-its. :)
//
// See other submissions here: https://openprocessing.org/curation/78544
// Join the Birb's Nest Discord community!  https://discord.gg/S8c7qcjw2b

// find the pink block - mtk 3/17/24

let gLeftPt;
let gRightPt;

let gAllBlocks = [];
let gBgGround = [];
let gBgSky = [];

let gDistFromPointMin;
let gWallHeightInc;
let gWallDistMin;

let gWindowLength;
let gWindowSpacing;

let gWindowColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);

  gWindowColor = color(255, 0.25);
  // set points for two point perspective calculations
  gLeftPt = createVector(0, 0.6 * windowHeight);
  gRightPt = createVector(windowWidth, 0.6 * windowHeight);
  gDistFromPointMin = windowWidth * 0.2;
  gWallDistMin = windowWidth * 0.1;

  createBuilding();
}

function draw() {
  background(90);

  // draw background

  noStroke();

  // let bgCol = color(30, 0, 60, 0.05);  
  // console.log("bk col34:"+ bgCol)
  // bgCol = color(35, 0, 60, 0.05);  
  // console.log("bk col35:"+ bgCol)

  for (let ground of gBgGround) {
    fill(random(30, 35), 0, 60, 0.05);
    triangle(ground.x, ground.y, gLeftPt.x, gLeftPt.y, gRightPt.x, gRightPt.y);
  }

  for (let sky of gBgSky) {
    let color3 = color(random(180, 250), 60, 80, 0.2)
    //    console.log("sky343:" + color3)
    fill(random(180, 250), 60, 80, 0.2);
    triangle(sky.x, sky.y, gLeftPt.x, gLeftPt.y, gRightPt.x, gRightPt.y);
  }

  // perspective lines
  strokeWeight(1); // draw horizon line
  line(0, gLeftPt.y, width, gRightPt.y);

  // draw building blocks
  for (let block of gAllBlocks) {
    block.draw();
  }
}

function createBuilding() {
  loop();

  // reset arrays
  gBgGround = [];
  gBgSky = [];
  gAllBlocks = [];
  // create background elements
  for (let i = 0; i < 50; i++) {
    gBgGround.push(createVector(random(-width, 2 * width), random(gLeftPt.y, height)));
    gBgSky.push(createVector(random(-width, 2 * width), random(-0.2 * height, gLeftPt.y)));
  }

  // create and stack building blocks
  let yp = 0.95 * height;
  let [upper, mid, lower] = [[], [], []];
  let count = random(18, 30);
  gWallHeightInc = (0.7 * height) / count;
  gWindowHeight = 0.8 * gWallHeightInc;
  gWindowLength = 0.5 * gWallHeightInc;
  gWindowSpacingX = 0.2 * gWindowLength;
  gWindowSpacingY = 0.1 * gWindowHeight;
  for (let i = 0; i < count; i++) {
    let block = new BuildingBlock(yp, i);
    block.level > 0 ? upper.push(block) : block.level < 0 ? lower.push(block) : mid.push(block);
    yp -= random(0.8, 1.2) * gWallHeightInc;
    //    console.log("yp343:" + yp)
  }

  // adjust array for rendering purposes
  gAllBlocks = [...upper, ...lower.reverse(), ...mid.reverse()];
  noLoop();
}

function mouseClicked() {
  createBuilding();
}

function getIntersectionPtWithConstant(constant, line) {
  let x = constant;
  let y = line.p0.y + ((constant - line.p0.x) * (line.p1.y - line.p0.y)) / (line.p1.x - line.p0.x);

  return createVector(x, y);
}

class BuildingBlock {
  constructor(yp, i) {
    // center corner
    const centerUpperPt = createVector(random(2 * gDistFromPointMin, width - 2 * gDistFromPointMin), yp);
    const centerLowerPt = createVector(centerUpperPt.x, centerUpperPt.y - random(0.5, 2.5) * gWallHeightInc);
    const centerLine = new Line(centerUpperPt, centerLowerPt);
    const centerLineHeight = centerUpperPt.y - centerLowerPt.y;

    // left side
    const leftPosX = random(gLeftPt.x + gDistFromPointMin, centerUpperPt.x - gWallDistMin);
    const leftCornerLine = this.getCornerLine(leftPosX, centerLine, gLeftPt);

    // right side
    const rightPosX = floor(random(centerUpperPt.x + gWallDistMin, gRightPt.x - gDistFromPointMin));
    const rightCornerLine = this.getCornerLine(rightPosX, centerLine, gRightPt);

    // ceiling
    const ceilingPt = this.getIntersectionPt(new Line(leftCornerLine.p1, gRightPt), new Line(rightCornerLine.p1, gLeftPt));
    const floorPt = this.getIntersectionPt(new Line(leftCornerLine.p0, gRightPt), new Line(rightCornerLine.p0, gLeftPt));

    // pick a color
    const cHue = random(0, 360);
    const cSat = random(30, 40); //40;
    const cLig = random(70, 80); //80;

    this.indx = i
    // create walls
    //    console.log("pts: " + points)
    // check color
    let color34 = color(cHue, cSat, cLig * 0.75)
    //console.log ("wall col34:" + color34)
    const createWall = (i, points, colorMultiplier, hasWindows) => new Wall(i, points, color(cHue, cSat, cLig * colorMultiplier), hasWindows);
    const ceilingWall = createWall(i, [leftCornerLine.p1, centerLine.p1, rightCornerLine.p1, ceilingPt], 1.0, false);
    const leftWall = createWall(i, [leftCornerLine.p1, leftCornerLine.p0, centerLine.p0, centerLine.p1], 0.9, true);
    const rightWall = createWall(i, [centerLine.p1, centerLine.p0, rightCornerLine.p0, rightCornerLine.p1], 0.75, true);
    const floorWall = createWall(i, [leftCornerLine.p0, centerLine.p0, rightCornerLine.p0, floorPt], 0.6, false);

    if (this.indx == 0) {
      console.log("right wall32:" + rightWall.allPoints)
    }
    // order walls for rendering purposes
    const isAboveLeftPt = centerUpperPt.y > gLeftPt.y && centerLowerPt.y > gLeftPt.y;
    const isBelowLeftPt = centerUpperPt.y < gLeftPt.y && centerLowerPt.y < gLeftPt.y;
    if (isAboveLeftPt) {
      this.allWalls = [ceilingWall, leftWall, rightWall];
      this.level = 1;
    } else if (isBelowLeftPt) {
      this.allWalls = [leftWall, rightWall, floorWall];
      this.level = -1;
    } else {
      this.allWalls = [leftWall, rightWall];
      this.level = 0;
    }
  }

  getCornerLine(ptX, line, perspectivePt) {
    let boundLines = [new Line(line.p0, perspectivePt), new Line(line.p1, perspectivePt)];

    let intersections = boundLines.map((boundLine) => getIntersectionPtWithConstant(ptX, boundLine));

    let line22 = new Line(...intersections)

    //print ("line22: " + line22 + " p0.x:" + line22.p0.x)

    return line22
  }

  getIntersectionPt(line0, line1) {
    let x = (line1.yIntercept - line0.yIntercept) / (line0.slope - line1.slope);
    let y = line0.slope * x + line0.yIntercept;
    return createVector(x, y);
  }

  draw() {
    stroke(255, 0, 0);
    strokeWeight(0.5);

    for (let wall of this.allWalls) {
      stroke(0);
      wall.draw();
    }
  }
}

class Wall {
  constructor(i, points, c, hasWindows = false) {
    this.allPoints = points;
    //    console.log("pts2:" + points)
    this.color = c;
    this.indxw = i;

    this.allWindows = [];
    if (hasWindows) {
      // calculate window parameters (size is based on how close wall is to center)
      const heightL = abs(this.allPoints[1].y - this.allPoints[0].y);
      const heightR = abs(this.allPoints[2].y - this.allPoints[3].y);
      const isHeightLMax = heightL > heightR;
      let heightMax;
      let posXMax;
      if (isHeightLMax) {
        heightMax = heightL;
        posXMax = this.allPoints[0].x;
      } else {
        heightMax = heightR;
        posXMax = this.allPoints[2].x;
      }

      const windowSizeScalar = 1 - abs(posXMax - width / 2) / (width / 2);
      const windowHeight = windowSizeScalar * gWindowHeight;
      const windowLength = windowSizeScalar * gWindowLength;
      const windowSpacingX = windowSizeScalar * gWindowSpacingX;
      const windowSpacingY = windowSizeScalar * gWindowSpacingY;
      const ratioWindowToWall = windowHeight / heightMax;
      const windowCount = floor(heightMax / (windowHeight + windowSpacingY)) - 1;

      // Create Windows
      if (windowCount > 0) {
        const windowHeightL = isHeightLMax ? windowHeight : ratioWindowToWall * heightL;
        const windowHeightR = isHeightLMax ? ratioWindowToWall * heightR : windowHeight;

        const spaceAvailable = heightL - windowHeightL * windowCount;
        const extraInc = spaceAvailable / windowCount;

        const percentInc = (extraInc + windowHeightL) / heightL;
        let percent = (0.5 * extraInc) / heightL;
        const wallDistance = this.allPoints[3].x - this.allPoints[0].x;
        const initPos = this.allPoints[3].x - windowSpacingY * 0.5;
        const wallLength = abs(wallDistance);
        const sign = wallDistance < 0 ? 1 : -1;

        const windowColCount = floor(wallLength / (windowLength + windowSpacingX)) - 2;
        const windowSpaceAvailable = wallLength - windowColCount * windowLength;
        const windowInc = windowSpaceAvailable / windowColCount + windowLength;

        for (let i = 0; i < windowCount; i++) {
          const adj1y = lerp(this.allPoints[1].y, this.allPoints[0].y, percent);
          const adj0y = adj1y - windowHeightL;
          const adj2y = lerp(this.allPoints[2].y, this.allPoints[3].y, percent);
          const adj3y = adj2y - windowHeightR;

          const topWindowLine = new Line(createVector(this.allPoints[0].x, adj0y), createVector(this.allPoints[3].x, adj3y));
          const bottomWindowLine = new Line(createVector(this.allPoints[2].x, adj2y), createVector(this.allPoints[1].x, adj1y));
          this.createWindow(topWindowLine, bottomWindowLine, windowLength, windowColCount, windowInc, sign, initPos);
          percent += percentInc;
        }
      }
    }
  }

  createWindow(topWindowLine, bottomWindowLine, windowSize, windowColCount, windowInc, sign, initPos) {
    for (let j = 0; j < windowColCount; j++) {
      const position0 = sign * j * windowInc + initPos;
      const position1 = position0 + sign * windowSize;
      const wpt0 = getIntersectionPtWithConstant(position0, bottomWindowLine);
      const wpt1 = getIntersectionPtWithConstant(position0, topWindowLine);
      const wpt2 = getIntersectionPtWithConstant(position1, topWindowLine);
      const wpt3 = getIntersectionPtWithConstant(position1, bottomWindowLine);
      this.allWindows.push([wpt0, wpt1, wpt2, wpt3]);
    }
  }

  draw() {
    //    console.log("indx: " + this.indxw)
    if (this.indxw == 10) {
      //      console.log("color23:" +this.color)
      fill(color('magenta'));
    } else {
      fill(this.color);
    }
    noStroke();
    quad(
      this.allPoints[0].x,
      this.allPoints[0].y,
      this.allPoints[1].x,
      this.allPoints[1].y,
      this.allPoints[2].x,
      this.allPoints[2].y,
      this.allPoints[3].x,
      this.allPoints[3].y
    );

    let color5 = color(hue(this.color), saturation(this.color), lightness(this.color) * 0.8, 0.5)
    //    console.log ("wincol:" + color5)
    fill(hue(this.color), saturation(this.color), lightness(this.color) * 0.8, 0.5);
    stroke(hue(this.color), saturation(this.color), lightness(this.color) * 0.8, 0.5);

    for (let window of this.allWindows) {
      quad(window[0].x, window[0].y, window[1].x, window[1].y, window[2].x, window[2].y, window[3].x, window[3].y);
    }
  }
}

class Line {
  constructor(p0, p1) {
    Object.assign(this, { p0, p1 });
    this.slope = p0.x === p1.x ? 0 : (p1.y - p0.y) / (p1.x - p0.x);
    this.yIntercept = this.p0.y - this.slope * this.p0.x;
  }

  draw() {
    line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
  }
}
