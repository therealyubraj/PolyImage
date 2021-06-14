class customImage {
    constructor(createNew = true) {
        this.startingNumberOfPolygons = 5;
        this.polygons = [];
        this.renderer = createGraphics(origImg.width, origImg.height);
        if (createNew) {
            for (let i = 0; i < this.startingNumberOfPolygons; i++) {
                this.polygons.push(new Poly());
            }
            this.drawIntoRenderer();
        }
        this.fitness = 0;
    }

    drawIntoCanvas(x, y) {
        image(this.renderer, x, y);
    }

    drawIntoRenderer() {
        this.polygons.forEach(p => {
            p.drawPolyIntoRenderer(this.renderer);
        });
        this.renderer.loadPixels();
    }

    getPixel(x, y) {
        let indOfPixel = x + y * width;
        let colorToRet = color(255);
        let startingInd = 4 * indOfPixel;
        colorToRet.setRed(this.renderer.pixels[startingInd + 0]);
        colorToRet.setGreen(this.renderer.pixels[startingInd + 1]);
        colorToRet.setBlue(this.renderer.pixels[startingInd + 2]);
        return colorToRet;
    }

    getFitness() {

        for (let i = 0; i < this.renderer.width; i++) {
            for (let j = 0; j < this.renderer.height; j++) {
                let origCol = getImagePixel(i, j);
                let generatedCol = this.getPixel(i, j);

                let deltaRed = red(origCol) - red(generatedCol);
                let deltaGreen = green(origCol) - green(generatedCol);
                let deltaBlue = blue(origCol) - blue(generatedCol);

                let toIncrease = deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue;
                if (isNaN(toIncrease)) {
                    console.log(i, j);
                    console.log(origCol);
                    console.log(generatedCol);
                }
                this.fitness += toIncrease;
            }
        }
    }

    addPolygons(n) {
        for (let i = 0; i < n; i++) {
            this.polygons.push(new Poly());
        }
    }

    mutate() {
        this.polygons.forEach(p => {
            p.mutate(formMR, colorMR);
        });
    }

    copy() {
        let c = new customImage(false);
        for (let i = 0; i < this.polygons.length; i++) {
            c.polygons.push(this.polygons[i].copy());
        }
        c.drawIntoRenderer();
        return c;
    }
}