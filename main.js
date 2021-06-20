let origImg;


let formMR = 1,
  populationSize = 50;

let population = [];
let bestGenerated;

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
  createCanvas(desiredWidth * 2, desiredHeight);

  origImg.resize(desiredWidth, desiredHeight);

  origImg.loadPixels();

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

  let currentPolygons = population[0].polygons.length;
  if (currentPolygons < maxPolygons && generation % polygonIncrementDuration == 0) {
    population.forEach((p) => {
      p.addPoly(polygonsToIncrement);
    })
  }

  let bestFitness = -Infinity;
  let avg = 0;
  population.forEach(p => {
    p.getFitness();
    avg += p.fitness;
    if (p.fitness > bestFitness) {
      bestGenerated = p;
      bestFitness = p.fitness;
    }
  });
  avg /= populationSize;
  avg *= 1.131;

  for (let i = 0; i < populationSize; i++) {
    let indToCopy = i;
    let p = population[indToCopy];
    let n = p.copy();
    n.mutate();
    n.getFitness();
    if (n.fitness > p.fitness) {
      console.error("Child won!");
      p.renderer.remove();
      p.renderer = null;
      p.poly = null;
      population[indToCopy] = n;
    } else if (p.fitness < avg) {
      console.error("HERE!!");
      p.renderer.remove();
      p.renderer = null;
      p.poly = null;
      n.renderer.remove();
      n.renderer = null;
      n.poly = null;
      population[indToCopy] = new customImage();
    } else {
      n.renderer.remove();
      n.renderer = null;
      n.poly = null;
    }
  }

  bestGenerated.drawIntoCanvas(origImg.width, 0);

  //free previous memory
  bestGenerated = null;

  console.log(generation);
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