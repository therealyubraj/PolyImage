let origImg;

let populationSize = 50;

let population = [];
let bestGeneratedImage;

let generation = 1;

let formMR = 0.1,
  colorMR = 0.1;

function preload() {
  origImg = loadImage("images/image.jpg");
}

function setup() {
  createCanvas(origImg.width * 2, origImg.height);
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

  //calc fitness
  let bestFitness = -Infinity;
  let bestFitnessInd = -1;
  population.forEach((p, i) => {
    p.getFitness();
    if (p.fitness > bestFitness) {
      bestFitness = p.fitness;
      bestFitnessInd = i;
    }
  });

  //choose by fitness
  let newPopn = [];
  for (let i = 0; i < population.length; i++) {
    let toCopy = population[pickOne()].copy();
    toCopy.mutate();
    newPopn.push(toCopy);
  }

  //free the memory
  if (generation > 1) {
    bestGeneratedImage.renderer.remove();
    bestGeneratedImage.renderer = null;
    bestGeneratedImage = null;
  }
  population.forEach((p, i) => {
    if (i == bestFitnessInd) {
      bestGeneratedImage = p.copy();
    }
    p.renderer.remove();
    p.renderer = null;
    p.poly = null;
  })

  //make new popn
  population = newPopn;

  generation++;

  console.log(generation, population.length);
  bestGeneratedImage.drawIntoCanvas(origImg.width, 0);
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