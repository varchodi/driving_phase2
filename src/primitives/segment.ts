import { PointType } from "../math/graph";

export class Segment{
    public p1: PointType;
    public p2: PointType;

    constructor(p1: PointType, p2: PointType) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(ctx: CanvasRenderingContext2D, width: number = 2, color = "black") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}