import {scale, add, substract } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Tree{
    constructor(public center: Point, public size: number,private hightCoef:number=0.3) {
        this.center = center;
        this.size = size; // size of base 
        this.hightCoef=hightCoef // tree hight controller
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint:Point) {
        
        const diff=substract(this.center,viewPoint)
        this.center.draw(ctx, { size: this.size, color: "green" })
        const top = add(this.center, scale(diff,this.hightCoef));
        new Segment(this.center, top).draw(ctx);
    }
}