let origImg;

let formMR = 1,
  populationSize = 50;

let population = [];
let bestGenerated, alternateCanvas;

let generation = 1;

let desiredWidth = 100,
  desiredHeight = 100;

let maxPolygons = 50,
  polygonsToIncrement = 1,
  polygonIncrementDuration = 50;


function preload() {
  origImg = loadImage("images/image.jpg");
}

function setup() {
  pixelDensity(1);
  createCanvas(desiredWidth * 2, desiredHeight);

  origImg.resize(desiredWidth, desiredHeight);
  origImg.loadPixels();

  alternateCanvas = createGraphics(origImg.width, origImg.height);

  alternateCanvas.loadPixels();

  console.log(alternateCanvas.pixels.length, origImg.pixels.length);

  for (let i = 0; i < populationSize; i++) {
    population.push(new customImage());
  }

  p5.Graphics.prototype.remove = function () {
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
    var idx = this._pInst._elements.indexOf(this);
    if (idx !== -1) {
      this._pInst._elements.splice(idx, 1);
    }
    for (var elt_ev in this._events) {
      this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
    }
  };
}

function draw() {
  background(0);
  image(origImg, 0, 0);

  population.forEach(p => {
    p.calcFitness();
  });

  let bestFitness = -Infinity;
  population.forEach(p => {
    if (p.fitness > bestFitness) {
      bestFitness = p.fitness;
      bestGenerated = p;
    }
  });

  for (let i = 0; i < populationSize; i++) {
    let indToPick = i;
    let p = population[indToPick];
    for (let j = 0; j < 10; j++) {
      let n = population[indToPick].copy();
      n.mutate();
      n.calcFitness();
      if (n.fitness > p.fitness) {
        population[indToPick] = n;
        break;
      }
    }
  }

  drawIntoCanvas(bestGenerated);
  //noLoop();
  console.log(generation, bestFitness);
  generation++;
}

function giveRandom(min, max) {
  return Math.floor(random(min, max + 1));
}

function getRadian(deg) {
  return (Math.PI * deg) / 180;
}

function getImagePixel(x, y) {
  let indOfPixel = x + y * origImg.width;
  let colorToRet = color(255);
  let startingInd = 4 * indOfPixel;
  colorToRet.setRed(origImg.pixels[startingInd + 0]);
  colorToRet.setGreen(origImg.pixels[startingInd + 1]);
  colorToRet.setBlue(origImg.pixels[startingInd + 2]);
  return colorToRet;
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r -= population[index].fitness;
    if (index >= populationSize - 1) {
      break;
    }
    index++;
  }
  index--;
  return index;
}

function drawIntoCanvas(c) {
  c.drawIntoRenderer();
  image(alternateCanvas, origImg.width, 0);
}