  let origImg;

let populationSize = 50;

let population = [];
let alternateCanvas;

let generation = 0;

let desiredWidth = 100,
  desiredHeight = 100;

let polygonAddGeneration = 50, polygonsToAdd = 1;

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

  //add one polygon every X generation:
  //choose the best addition

  if (generation % polygonAddGeneration == 0) {
    //add polygons
    population.forEach((p) => {
      p.addPoly(polygonsToAdd);
    });
    console.error(polygonsToAdd, "Polygons added!!!", generation, population[0].polygons.length);

    let bestImage, bestFitness = -Infinity;
    population.forEach(p => {
      p.calcFitness();

      if (bestFitness < p.fitness) {
        bestImage = p.copy();
        bestFitness = p.fitness;
      }
    });

    //replace all the new ones by this
    population = [];
    for (let i = 0; i < populationSize; i++) {
      population.push(bestImage.copy());
    };
    
    drawIntoCanvas(bestImage);
  }
  else {
    //mutate the newly added polygon
    //mutate for X gens and repeat
    let bestImage, bestFitness = -Infinity;
    let fitnessSum = 0;
    population.forEach(p => {
      p.calcFitnessMutation();
      fitnessSum += p.fitness;
      if (bestFitness < p.fitness) {
        bestImage = p.copy();
        bestFitness = p.fitness;
      }
    });
    let normalizedSum = 0;
    population.forEach(p => {
      p.normalizedFitness = p.fitness / fitnessSum;
      normalizedSum += p.normalizedFitness;
    });

    let newPopulation = [];
    for (let i = 0; i < populationSize; i++) {
      let toMutateInd = pickOne(normalizedSum);
      let toMutate = population[toMutateInd];
      let mutated = toMutate.copy();

      let maxAttempts = 10, curAttempt = 0;

      while (curAttempt < maxAttempts) {
        mutated = toMutate.copy();
        mutated.mutate();
        mutated.calcFitnessMutation();
        if (mutated.fitness > toMutate.fitness) {
          newPopulation.push(mutated);
          break;
        }
        curAttempt++;
      }

      if (curAttempt >= maxAttempts) {
        newPopulation.push(toMutate.copy());
        //console.log("COULD NOT FIND BETTER MUTATION!!!")
      }
    }
    population = newPopulation;

    drawIntoCanvas(bestImage);
  }

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

function pickOne(sum) {
  let index = 0;
  let r = random(sum);
  let s = 0;
  while (r > s) {
    if (index >= populationSize) {
      console.log(r, s, index);
    }
    s += population[index].normalizedFitness;
    index++;
  }
  index--;
  return index;
}

function drawIntoCanvas(c) {
  c.drawIntoGraphics();
  image(alternateCanvas, origImg.width, 0);
}