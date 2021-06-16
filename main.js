let origImg;


let formMR = 0.01,
  populationSize = 50;

let population = [];
let bestGenerated;

let generation = 1;

let desiredWidth = 100,
  desiredHeight = 100;

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

  if (generation < 4000  && generation % 200 == 0) {
    population.forEach((p) => {
      p.addPoly(5);
    })
  }

  let sumOfFitness = 0;
  population.forEach(p => {
    p.getFitness();
    sumOfFitness += p.fitness;
  });

  let bestFitness = -Infinity;
  population.forEach(p => {
    p.fitness /= sumOfFitness;
    if (p.fitness > bestFitness) {
      bestGenerated = p;
      bestFitness = p.fitness;
    }
  });

  let newPopulation = [];
  for (let i = 0; i < populationSize; i++) {
    let n = population[pickOne()].copy();
    n.mutate();
    newPopulation.push(n);
  }

  bestGenerated.drawIntoCanvas(origImg.width, 0);

  //free previous memory
  bestGenerated = null;
  population.forEach((p, i) => {
    p.renderer.remove();
    p.renderer = null;
    p.poly = null;
  })

  population = newPopulation;
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