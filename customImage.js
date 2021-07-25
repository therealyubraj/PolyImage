class customImage {
  static numberOfPolygons = 0;

  constructor(createNew = false) {
    this.polygons = [];
    if (createNew) {
      for (let i = 0; i < customImage.numberOfPolygons; i++) {
        this.polygons.push(new Poly());
      }
    }
    this.fitness = 0;
    this.normalizedFitness = 0;
  }

  calcFitnessMutation() {
    let s = 0;
    this.drawIntoGraphics();
    alternateCanvas.loadPixels();
    let rectToCheck = this.polygons[this.polygons.length - 1].getPolyRect();
    //console.log(rectToCheck.min.x, rectToCheck.min.y, rectToCheck.max.x, rectToCheck.max.y);
    for (let i = rectToCheck.min.x; i <= rectToCheck.max.x; i++) {
      for (let j = rectToCheck.min.y; j <= rectToCheck.max.y; j++) {
        let origCol = getImagePixel(i, j);
        let genCol = getImagePixel(i, j, alternateCanvas);

        let deltaR = Math.abs(red(origCol) - red(genCol));
        let deltaG = Math.abs(green(origCol) - green(genCol));
        let deltaB = Math.abs(blue(origCol) - blue(genCol));

        s += deltaB + deltaG + deltaR;
      }
    }
    s /= 1 + ((rectToCheck.max.x - rectToCheck.min.x) * (rectToCheck.max.y - rectToCheck.min.y)) ;
    this.fitness = 1 / (1 + s);
  }
  
  calcFitness() {
    let s = 0;
    this.drawIntoGraphics();
    alternateCanvas.loadPixels();
    for (let i = 0; i < origImg.width; i++) {
      for (let j = 0; j < origImg.height; j++) {
        let origCol = getImagePixel(i, j);
        let genCol = getImagePixel(i, j, alternateCanvas);

        let deltaR = Math.abs(red(origCol) - red(genCol));
        let deltaG = Math.abs(green(origCol) - green(genCol));
        let deltaB = Math.abs(blue(origCol) - blue(genCol));

        s += deltaB + deltaG + deltaR;
      }
    }
    this.fitness = 1 / (1 + s);
  }
  addPoly(n) {
    for (let i = 0; i < n; i++) {
      this.polygons.push(new Poly());
    }
  }

  drawIntoGraphics() {
    alternateCanvas.background(0);
    this.polygons.forEach((p) => {
      p.drawPolyIntoGraphics();
    });
  }

  mutate() {
    let lastInd = this.polygons.length - 1;
    //console.error(lastInd);
    this.polygons[lastInd].mutate();
  }

  copy() {
    let c = new customImage();
    for (let i = 0; i < this.polygons.length; i++) {
      c.polygons.push(this.polygons[i].copy());
    }
    return c;
  }
}
