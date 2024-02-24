let cw, ch
let diagram, voronoi

let shapes = []
let cycleFrames = 45
let lastColor
let sw = 5

function setup () {
  cw = windowWidth
  ch = windowHeight
  createCanvas(cw, ch)
  colorMode(HSB)
  strokeCap(SQUARE)
	pixelDensity(1)
}

let currentCycle

function draw () {
  push()
  translate(-sw, -sw)
  let fullCycle = (frameCount % (cycleFrames * 3))
  let cycle = floor(fullCycle / cycleFrames)
  let t = (fullCycle % cycleFrames) / cycleFrames
  t = ease(t)
  if (currentCycle != cycle && cycle == 0) {
    if (shapes.length > 0) {
      lastColor = shapes[0].color.toString("#rrggbb")
    }
    shapes = generateVoronoiRegions()
  }
  background(lastColor || 0)
  if (cycle == 0) {
    drawPoints(t)
  } else if (cycle == 1) {
    drawLines(t)
  } else {
    drawPlanes(t)
  }
  currentCycle = cycle
  pop()
}

let drawPoints = (t) => {
  // Draw the points of the polygons
  for (let polygon of shapes) {
    for (let point of polygon.polygon) {
      let { x, y } = point
      let p = polygon.color
      p.setAlpha(t)
      fill(p)
      noStroke()
      circle(x, y, 5)
    }
  }
}

let drawLines = (t) => {
  // Draw the lines of the polygons
  drawPoints(1)
  for (let polygon of shapes) {
    noFill()
    stroke(polygon.color)
    strokeWeight(sw)
    for (let i = 0; i < polygon.polygon.length; i++) {
      let start = polygon.polygon[i]
      let end = polygon.polygon[(i + 1) % polygon.polygon.length]
      let x = lerp(start.x, end.x, t/2)
      let y = lerp(start.y, end.y, t/2)
      line(start.x, start.y, x, y)
    }
  }
}

let drawPlanes = (t) => {
  drawLines(1)
  // Draw the planes of the polygons
  for (let polygon of shapes) {
    let p = color(polygon.color.toString())
    p.setAlpha(t)
    fill(p)

    push()
    beginClip()
    beginShape()
    for (let point of polygon.polygon) {
      let { x, y } = point
      vertex(x, y)
    }
    endShape(CLOSE)
    endClip()
    let bounds = getBounds(polygon.polygon)
    let { left, right, top, bottom } = bounds
    noStroke()
    let h = bottom - top
    let y = top + h * t

    let diag = sqrt(sq(right - left) + sq(bottom - top)) * 2
    let startAngle, endAngle
    switch (polygon.transition) {
      case 0:
        startAngle = 0
        endAngle = PI / 2
        arc(left, top, diag, diag, startAngle, lerp(startAngle, endAngle, t))
        break
      case 1:
        startAngle = PI / 2
        endAngle = PI
        arc(right, top, diag, diag, startAngle, lerp(startAngle, endAngle, t))
        break
      case 2:
        startAngle = PI
        endAngle = 3 * PI / 2
        arc(right, bottom, diag, diag, startAngle, lerp(startAngle, endAngle, t))
        break
      case 3:
        startAngle = 3 * PI / 2
        endAngle = TWO_PI
        arc(left, bottom, diag, diag, startAngle, lerp(startAngle, endAngle, t))
        break
    }
    pop()
  }
}

let getBounds = (points) => {
  let bounds = {
    left: Infinity,
    right: -Infinity,
    top: Infinity,
    bottom: -Infinity,
  }
  for (let point of points) {
    let { x, y } = point
    bounds.left = min(bounds.left, x)
    bounds.right = max(bounds.right, x)
    bounds.top = min(bounds.top, y)
    bounds.bottom = max(bounds.bottom, y)
  }
  return bounds
}

let generateVoronoiRegions = () => {
  let points = []
  let polygons = []
  for (let i = 0; i < 100; i++) {
    points.push({ x: random(cw + 2 * sw), y: random(ch + 2 * sw) })
  }
  diagram = generateVoronoi(points)
  // console.log(diagram)
  // Draw the voronoi diagram
  let c = color(random(360), 80, 100)

  // let c = chroma.random()
  // if (lastColor) {
  //   let contrast = chroma.contrast(c, chroma(lastColor))
  //   while (contrast < 3) {
  //     c = chroma.random()
  //     contrast = chroma.contrast(c, chroma(lastColor))
  //   }
  // }
//  c = color(c.hex())


  for (let cell of diagram.cells) {
    let polygon = []
    let { site, halfedges } = cell
    for (let halfedge of halfedges) {
      polygon.push(halfedge.getStartpoint())
    }
    polygons.push({
      polygon,
      color: c,
      transition: floor(random(4))
    })
  }
  return polygons
}

function generateVoronoi(points) {
  if (voronoi && diagram) {
    voronoi.recycle(diagram)
  } else {
    voronoi = voronoi || new Voronoi()
  }
  let bbox = {
    xl: 0,
    xr: cw + 2*sw,
    yt: 0,
    yb: ch + 2*sw,
  }
  let d = voronoi.compute(points, bbox)
  return d
}

let ease = (x) => {
  // return sqrt(1 - pow(x - 1, 2))
  return x * x * x
}