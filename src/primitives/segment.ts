import { Point } from "./point";

export class Segment{
    public p1: Point;
    public p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }
    // chack if 2 sments r the same (or located at the same place)
    equals(seg: this): boolean {
        //if include both points 
        return this.include(seg.p1) && this.include(seg.p2);
        // (this.p1.equals(seg.p1) && this.p2.equals(seg.p2)) || (this.p1.equals(seg.p2) && this.p2.equals(seg.p1))
    }

    //equals helper function
    //2 segmets are equals if the have the same points
    include(point: Point) {
        //check if the first or secont point of the segment ;
        return this.p1.equals(point) || this.p2.equals(point);
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