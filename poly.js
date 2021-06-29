class Poly {
    static spikiness = 0.5;
    static irregularity = 0.5;
    static minSides = 3;
    static maxSides = 8;
    static maxSize = 40;
    static minSize = 10;

    constructor() {
        this.points = [];

        this.numberOfPoints = giveRandom(Poly.minSides, Poly.maxSides);
        this.size = giveRandom(Poly.minSize, Poly.maxSize);

        this.x = giveRandom(this.size / 2, origImg.width - (this.size / 2));
        this.y = giveRandom(this.size / 2, height - (this.size / 2));

        this.polyAngle = 360 / this.numberOfPoints;
        this.rotation = giveRandom(0, 360);
        this.opacity = giveRandom(180, 255);

        for (let i = 0; i < this.numberOfPoints; i++) {
            let vecX = this.x,
                vecY = this.y;

            let ang = this.polyAngle * i + this.rotation;
            let len = this.size;

            if (random() < Poly.irregularity) {
                ang += giveRandom(-this.polyAngle / 2, this.polyAngle / 2);
            }

            if (random() < Poly.spikiness) {
                len += giveRandom(-this.size / 2, this.size / 2);
            }

            let dx = len * Math.sin(getRadian(ang));
            let dy = len * -Math.cos(getRadian(ang));

            vecX += dx;
            vecY += dy;

            let v = createVector(vecX, vecY);
            this.points.push(v);
        }

        // let r = giveRandom(0, 255);
        // let g = giveRandom(0, 255);
        // let b = giveRandom(0, 255);
        let c = getImagePixel(this.x, this.y);
        let r = red(c);
        let g = green(c);
        let b = blue(c);
        this.color = color(r, g, b, this.opacity);
    }

    drawPolyIntoGraphics() {
        alternateCanvas.noStroke();
        alternateCanvas.fill(this.color);
        alternateCanvas.beginShape();
        this.points.forEach(p => {
            alternateCanvas.vertex(p.x, p.y);
        });
        alternateCanvas.endShape(CLOSE);
    }

    copy() {
        let poly = new Poly();

        poly.numberOfPoints = this.numberOfPoints;
        poly.size = this.size;
        poly.x = this.x;
        poly.y = this.y;
        poly.polyAngle = this.polyAngle;
        poly.rotation = this.rotation;
        poly.points = [];
        for (let i = 0; i < this.numberOfPoints; i++) {
            poly.points.push(createVector(this.points[i].x, this.points[i].y));
        }
        poly.color.setRed(red(this.color));
        poly.color.setGreen(green(this.color));
        poly.color.setBlue(blue(this.color));

        return poly;
    }

    mutate() {
        this.x += giveRandom(-10, 10);
        this.y += giveRandom(-10, 10);

        this.x = constrain(this.x, 0, desiredWidth);
        this.y = constrain(this.y, 0, desiredHeight);

        this.opacity += giveRandom(-10, 10);
        this.opacity = constrain(this.opacity, 180, 255);
        for (let i = 0; i < this.numberOfPoints; i++) {
            this.points[i].x += giveRandom(-this.size / 3, this.size / 3);
            this.points[i].y += giveRandom(-this.size / 3, this.size / 3);
        }

        let c = getImagePixel(this.x, this.y);
        let r = red(c);
        let g = green(c);
        let b = blue(c);
        this.color = color(r, g, b, this.opacity);
    }

    printPoly() {
        console.log("x:", this.x, 'y:', this.y, 'sides:', this.numberOfPoints, 'size:', this.size);
    }
}