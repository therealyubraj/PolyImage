class Poly {
    static opacity = 180;
    static spikiness = 1;
    static irregularity = 1;
    static minSides = 3;
    static maxSides = 8;

    constructor() {
        this.points = [];
        this.numberOfPoints = giveRandom(Poly.minSides, Poly.maxSides);
        this.size = giveRandom(20, 30);
        if (generation > 100) {
            this.size = giveRandom(10, 15);
        }
        this.x = giveRandom(0, width);
        this.y = giveRandom(0, height);
        this.polyAngle = 360 / this.numberOfPoints;
        this.rotation = giveRandom(0, 360);
        for (let i = 0; i < this.numberOfPoints; i++) {
            let vecX = this.x,
                vecY = this.y;

            let ang = this.polyAngle * i + this.rotation;
            let len = this.size;

            if (random() < Poly.irregularity) {
                ang += giveRandom(-20, 20);
            }

            if (random() < Poly.spikiness) {
                len += giveRandom(-20, 20);
            }

            let dx = len * Math.sin(getRadian(ang));
            let dy = len * -Math.cos(getRadian(ang));

            vecX += dx;
            vecY += dy;

            let v = createVector(vecX, vecY);
            this.points.push(v);
        }

        let r = giveRandom(0, 255);
        let g = giveRandom(0, 255);
        let b = giveRandom(0, 255);
        this.color = color(r, g, b, Poly.opacity);
    }

    drawPolyIntoRenderer(renderer) {
        renderer.noStroke();
        renderer.fill(this.color);
        renderer.beginShape();
        this.points.forEach(p => {
            renderer.vertex(p.x, p.y);
        });
        renderer.endShape(CLOSE);
    }

    drawPoly() {
        noStroke();
        fill(this.color);
        beginShape();
        this.points.forEach(p => {
            vertex(p.x, p.y);
        });
        endShape(CLOSE);
    }

    mutate(mrForm, mrColor) {
        if (random() < mrForm) {
            this.size += giveRandom(-5, 5);
            this.x += giveRandom(-10, 10);
            this.y += giveRandom(-10, 10);
            this.rotation += giveRandom(-10, 10);
            this.rotation = Math.max(0, this.rotation);

            this.numberOfPoints += giveRandom(-2, 2);
            this.numberOfPoints = Math.max(Poly.minSides, this.numberOfPoints);
            this.numberOfPoints = Math.min(this.numberOfPoints, Poly.maxSides);
            this.polyAngle = 360 / this.numberOfPoints;
            this.points = [];

            for (let i = 0; i < this.numberOfPoints; i++) {
                let vecX = this.x,
                    vecY = this.y;

                let ang = this.polyAngle * i + this.rotation;
                let len = this.size;

                if (random() < Poly.irregularity) {
                    ang += giveRandom(-20, 20);
                }

                if (random() < Poly.spikiness) {
                    len += giveRandom(-20, 20);
                }

                let dx = len * Math.sin(getRadian(ang));
                let dy = len * -Math.cos(getRadian(ang));

                vecX += dx;
                vecY += dy;

                let v = createVector(vecX, vecY);
                this.points.push(v);
            }
        }

        if (random() < mrColor) {
            this.color.setRed(red(this.color) + giveRandom(-10, 10));
            this.color.setGreen(green(this.color) + giveRandom(-10, 10));
            this.color.setBlue(blue(this.color) + giveRandom(-10, 10));
        }
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
}