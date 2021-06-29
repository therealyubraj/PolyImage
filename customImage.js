class customImage {
    static numberOfPolygons = 50;

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

    calcFitness() {
        let s = 0;
        this.drawIntoGraphics();
        alternateCanvas.loadPixels();
        for (let i = 0; i < alternateCanvas.width; i++) {
            for (let j = 0; j < alternateCanvas.height; j++) {
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

    drawIntoGraphics() {
        alternateCanvas.background(0);
        this.polygons.forEach((p) => {
            p.drawPolyIntoGraphics();
        })
    }

    mutate() {
        this.polygons.forEach(p => p.mutate());
    }

    copy() {
        let c = new customImage();
        for (let i = 0; i < this.polygons.length; i++) {
            c.polygons.push(this.polygons[i].copy());
        }
        return c;
    }

    static crossover(parent1, parent2) {
        let toRet = parent1.copy();

        let copyInd = giveRandom(0, Poly.numberOfPolygons - 2);
        for (let i = copyInd; i < this.numberOfPolygons; i++) {
            toRet.polygons[i] = parent2.polygons[i].copy();
        }
        return toRet;
    }
}