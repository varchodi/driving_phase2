import { add, distance, magnitude, normalize, scale, substract,dot } from "../math/utils";
import { Point } from "./point";

export class Segment{
    public p1: Point;
    public p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }

    //segment length
    length():number {
        return distance(this.p1, this.p2);
    }

    //direction vector
    directionVector() {
        return normalize(substract(this.p2, this.p1));
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

    //distance point and segment 
    distanceToPoint(point:Point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
           return distance(point, proj.point);
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
     }
  
     projectPoint(point:Point) {
        const a = substract(point, this.p1);
        const b = substract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);
        const proj = {
           point: add(this.p1, scale(normB, scaler)),
           offset: scaler / magnitude(b),
        };
        return proj;
     }
  

    draw(ctx: CanvasRenderingContext2D, { width = 2, color = "black", dash= [],cap="butt" }:{width?:number,color?:string,dash?:number[],cap?:CanvasLineCap}={}) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.lineCap = cap;
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}