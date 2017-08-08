export default class Point {
    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    minus(p) {
        return new Point(this.x - p.x, this.y - p.y);
    }

    plus(p) {
        return new Point(this.x + p.x, this.y + p.y);
    }
}
