class customImage {
    static startingNumberOfPolygons = 5;
    constructor(createNew = true) {
        this.polygons = [];
        if (createNew) {
            for (let i = 0; i < customImage.startingNumberOfPolygons; i++) {
                this.polygons.push(new Poly());
            }
        }
        this.fitness = 0;
    }

    drawIntoRenderer() {
        alternateCanvas.background(0);
        this.polygons.forEach(p => {
            p.drawPolyIntoRenderer();
        });
        alternateCanvas.loadPixels();
    }

    getPixel(x, y) {
        let indOfPixel = x + y * origImg.width;
        let colorToRet = color(255);
        let startingInd = 4 * indOfPixel;
        colorToRet.setRed(alternateCanvas.pixels[startingInd + 0]);
        colorToRet.setGreen(alternateCanvas.pixels[startingInd + 1]);
        colorToRet.setBlue(alternateCanvas.pixels[startingInd + 2]);
        return colorToRet;
    }

    calcFitness() {
        let s = 0;
        this.drawIntoRenderer();
        for (let i = 0; i < alternateCanvas.width; i++) {
            for (let j = 0; j < alternateCanvas.height; j++) {
                let origCol = getImagePixel(i, j);
                let generatedCol = this.getPixel(i, j);

                let deltaRed = red(origCol) - red(generatedCol);
                let deltaGreen = green(origCol) - green(generatedCol);
                let deltaRed = Math.abs(red(origCol) - red(generatedCol));
                let deltaGreen = Math.abs(green(origCol) - green(generatedCol));
                let deltaBlue = Math.abs(blue(origCol) - blue(generatedCol));

                s += deltaBlue + deltaGreen + deltaRed;
                s /= 3;
            }
        }
        this.fitness = 1 / (1 + s);
    }


    addPoly(n) {
        for (let i = 0; i < n; i++) {
            this.polygons.push(new Poly());
        }
    }

    copy() {
        let c = new customImage(false);
        for (let i = 0; i < this.polygons.length; i++) {
            c.polygons.push(this.polygons[i].copy());
        }
        c.fitness = this.fitness;
        return c;
    }

    mutate() {
        this.polygons.forEach(p => {
            p.mutate(formMR);
        });
    }

}