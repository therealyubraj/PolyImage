let origImg;

let mutationRate = 0.03;
let populationSize = 75;

let population = [];
let alternateCanvas;

let generation = 1;

let desiredWidth = 50,
  desiredHeight = 50;

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

  for (let i = 0; i < populationSize; i++) {
    population.push(new customImage(true));
  }

  console.log(alternateCanvas.pixels.length, origImg.pixels.length);
}

function draw() {
  background(0);
  image(origImg, 0, 0);

  let sumOfFitness = 0;
  population.forEach(p => {
    p.calcFitness();
    sumOfFitness += p.fitness;
  });

  population.forEach((p) => p.normalizedFitness = p.fitness / sumOfFitness);
  population.sort((p1, p2) => p2.normalizedFitness - p1.normalizedFitness);

  for (let i = 0; i < populationSize; i++) {
    if (random() < mutationRate) {
      let toMutateInd = pickOne();
      let toMutate = population[toMutateInd];

      console.error("Mutating", toMutateInd);

      let maxTries = Infinity;
      let currentTries = 0;

      while (maxTries > currentTries) {
        let mutatedImage = toMutate.copy();
        mutatedImage.mutate();
        mutatedImage.calcFitness();
        if (mutatedImage.fitness > toMutate.fitness) {
          console.error("Mutation improved stuffs!!");
          population[toMutateInd] = mutatedImage;
          break;
        }
        currentTries++;
      }
    }
  }

  if (generation % 10 == 0) {
    for (let i = populationSize - 11; i < populationSize; i++) {
      let parent1 = population[pickOne()];
      let parent2 = population[pickOne()];
      population[i] = customImage.crossover(parent1, parent2);
    }
  }

  population[0].drawIntoGraphics();

  image(alternateCanvas, desiredWidth, 0);
  console.log(generation);
  generation++;
}

function giveRandom(min, max) {
  return Math.floor(random(min, max + 1));
}

function getRadian(deg) {
  return (Math.PI * deg) / 180;
}

function getImagePixel(x, y, img = origImg) {
  let indOfPixel = x + y * img.width;
  let colorToRet = color(255);
  let startingInd = 4 * indOfPixel;
  colorToRet.setRed(img.pixels[startingInd + 0]);
  colorToRet.setGreen(img.pixels[startingInd + 1]);
  colorToRet.setBlue(img.pixels[startingInd + 2]);
  return colorToRet;
}

function pickOne() {
  let index = 0;
  let r = random(0.7);
  let s = 0;
  while (r > s) {
    s += population[index].normalizedFitness;
    index++;
  }
  index--;
  return index;
}

function drawIntoCanvas(c) {
  c.drawIntoRenderer();
  image(alternateCanvas, origImg.width, 0);
}