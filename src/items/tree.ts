import { add, substract } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Tree{
    constructor(public center: Point, public size: number) {
        this.center = center;
        this.size = size; // size of base 
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint:Point) {
        
        const diff=substract(this.center,viewPoint)
        this.center.draw(ctx, { size: this.size, color: "green" })
        const top = add(this.center, diff);
        new Segment(this.center, top).draw(ctx);
    }
}