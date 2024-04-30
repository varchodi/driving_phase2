import { Point } from "../primitives/point";

export class Tree{
    constructor(public center: Point, public size: number) {
        this.center = center;
        this.size = size; // size of base 
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.center.draw(ctx,{size:this.size,color:"green"})
    }
}